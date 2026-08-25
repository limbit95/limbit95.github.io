import { attachPublicProfiles } from "./profiles.js";
import { compact, supabase, unwrap } from "./shared.js";

export async function listPosts({
  boardType,
  search = "",
  page = 1,
  pageSize = 12,
} = {}) {
  const offset = (page - 1) * pageSize;
  let query = supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("board_type", boardType)
    .eq("status", "published")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);
  if (search.trim()) {
    query = query.textSearch("title", search.trim(), {
      type: "plain",
      config: "simple",
    });
  }
  const { data, error, count } = await query;
  if (error) throw error;
  return {
    rows: await attachPublicProfiles(data ?? []),
    count: count ?? 0,
  };
}

export async function getPost(postId) {
  const post = unwrap(await supabase
    .from("posts")
    .select("*")
    .eq("id", Number(postId))
    .single());
  const [withAuthor] = await attachPublicProfiles([post]);
  return withAuthor;
}

export async function incrementPostView(postId) {
  return unwrap(await supabase.rpc("increment_post_view", {
    p_post_id: Number(postId),
  }));
}

export async function createPost(payload) {
  return unwrap(await supabase
    .from("posts")
    .insert(compact(payload))
    .select()
    .single());
}

export async function updatePost(postId, payload) {
  return unwrap(await supabase
    .from("posts")
    .update(compact(payload))
    .eq("id", Number(postId))
    .select()
    .single());
}

export async function deletePost(postId) {
  unwrap(await supabase.from("posts").delete().eq("id", Number(postId)));
}

export async function listComments(targetType, targetId) {
  const rows = unwrap(await supabase
    .from("comments")
    .select("*")
    .eq("target_type", targetType)
    .eq("target_id", Number(targetId))
    .eq("status", "published")
    .order("created_at", { ascending: true })) ?? [];
  return attachPublicProfiles(rows);
}

export async function createComment(payload) {
  return unwrap(await supabase
    .from("comments")
    .insert(compact(payload))
    .select()
    .single());
}

export async function updateComment(commentId, content) {
  return unwrap(await supabase
    .from("comments")
    .update({ content })
    .eq("id", Number(commentId))
    .select()
    .single());
}

export async function deleteComment(commentId) {
  unwrap(await supabase.from("comments").delete().eq("id", Number(commentId)));
}
