import { AVATAR_BUCKET } from "../constants.js";
import { compact, supabase, unwrap } from "./shared.js";

const avatarUrlCache = new Map();

export async function getSignedAvatarUrl(path, expiresIn = 3600) {
  if (!path) return "./assets/images/default-avatar.svg";
  const cached = avatarUrlCache.get(path);
  if (cached && cached.expiresAt > Date.now()) return cached.url;
  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(path, expiresIn);
  if (error) return "./assets/images/default-avatar.svg";
  avatarUrlCache.set(path, {
    url: data.signedUrl,
    expiresAt: Date.now() + Math.max(60, expiresIn - 60) * 1000,
  });
  return data.signedUrl;
}

export async function getPublicProfiles(userId = null) {
  const data = unwrap(await supabase.rpc("get_public_member_profiles", {
    p_user_id: userId,
  }));
  return data ?? [];
}

export async function attachPublicProfiles(rows, idKey = "author_id", resultKey = "author") {
  if (!rows?.length) return rows ?? [];
  const profiles = await getPublicProfiles();
  const byId = new Map(profiles.map((profile) => [profile.id, profile]));
  return rows.map((row) => ({ ...row, [resultKey]: byId.get(row[idKey]) ?? null }));
}

export async function getProfileInterests(userId) {
  return unwrap(await supabase
    .from("profile_interests")
    .select("user_id,category_id,category:activity_categories(*)")
    .eq("user_id", userId)) ?? [];
}

export async function updateProfile(userId, payload) {
  return unwrap(await supabase
    .from("profiles")
    .update(compact(payload))
    .eq("id", userId)
    .select()
    .single());
}

export async function replaceProfileInterests(userId, categoryIds) {
  const { error: deleteError } = await supabase
    .from("profile_interests")
    .delete()
    .eq("user_id", userId);
  if (deleteError) throw deleteError;
  if (!categoryIds.length) return [];
  return unwrap(await supabase
    .from("profile_interests")
    .insert(categoryIds.map((categoryId) => ({
      user_id: userId,
      category_id: Number(categoryId),
    })))
    .select()) ?? [];
}

export async function uploadAvatar(userId, file, previousPath = null) {
  const extensionMap = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const extension = extensionMap[file.type] ?? "bin";
  const path = `${userId}/profile-${Date.now()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, {
      upsert: false,
      cacheControl: "3600",
      contentType: file.type,
    });
  if (uploadError) throw uploadError;

  try {
    await updateProfile(userId, { avatar_path: path });
    if (previousPath && previousPath !== path) {
      await supabase.storage.from(AVATAR_BUCKET).remove([previousPath]);
      avatarUrlCache.delete(previousPath);
    }
    return path;
  } catch (error) {
    await supabase.storage.from(AVATAR_BUCKET).remove([path]);
    throw error;
  }
}
