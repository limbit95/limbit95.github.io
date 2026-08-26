import { attachPublicProfiles } from "./profiles.js";
import { compact, supabase, unwrap } from "./shared.js";

const POST_COLUMNS = "id,board_type,title,content,author_id,is_pinned,is_important,view_count,status,created_at,updated_at";
const COMMENT_COLUMNS = "id,target_type,target_id,author_id,content,status,created_at,updated_at";

export async function listPosts({
  boardType,
  search = "",
  page = 1,
  pageSize = 12,
} = {}) {
  const offset = (page - 1) * pageSize;
  let query = supabase
    .from("posts")
    .select(POST_COLUMNS, { count: "exact" })
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
    .select(POST_COLUMNS)
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
    .select(POST_COLUMNS)
    .single());
}

export async function updatePost(postId, payload) {
  return unwrap(await supabase
    .from("posts")
    .update(compact(payload))
    .eq("id", Number(postId))
    .select(POST_COLUMNS)
    .single());
}

export async function deletePost(postId) {
  unwrap(await supabase.from("posts").delete().eq("id", Number(postId)));
}

export async function listCommentsPage(targetType, targetId, {
  limit = 10,
  beforeId = null,
  excludeContent = null,
  withCount = false,
} = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const table = supabase.from("comments");
  let query = withCount
    ? table.select(COMMENT_COLUMNS, { count: "exact" })
    : table.select(COMMENT_COLUMNS);
  query = query
    .eq("target_type", targetType)
    .eq("target_id", Number(targetId))
    .eq("status", "published")
    .order("id", { ascending: false })
    .limit(safeLimit + 1);
  if (beforeId !== null && beforeId !== undefined) {
    query = query.lt("id", Number(beforeId));
  }
  if (excludeContent !== null && excludeContent !== undefined) {
    query = query.neq("content", excludeContent);
  }
  const { data, error, count } = await query;
  if (error) throw error;
  const rows = data ?? [];
  const selected = rows.slice(0, safeLimit);
  const hasMore = rows.length > safeLimit;
  const oldestId = selected.length ? Number(selected[selected.length - 1].id) : null;
  return {
    rows: await attachPublicProfiles([...selected].reverse()),
    count: withCount ? count ?? 0 : null,
    hasMore,
    nextBeforeId: hasMore ? oldestId : null,
  };
}

export async function getCommentReactionSummary(targetType, targetId, authorId, reactionText) {
  const countQuery = supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("target_type", targetType)
    .eq("target_id", Number(targetId))
    .eq("status", "published")
    .eq("content", reactionText);
  const myReactionQuery = supabase
    .from("comments")
    .select("id,author_id")
    .eq("target_type", targetType)
    .eq("target_id", Number(targetId))
    .eq("status", "published")
    .eq("content", reactionText)
    .eq("author_id", authorId)
    .limit(1)
    .maybeSingle();
  const [countResult, myReactionResult] = await Promise.all([countQuery, myReactionQuery]);
  if (countResult.error) throw countResult.error;
  if (myReactionResult.error) throw myReactionResult.error;
  return {
    count: countResult.count ?? 0,
    myReaction: myReactionResult.data ?? null,
  };
}

// Backward compatibility for cached pre-P2 prayer detail modules.
export async function listComments(targetType, targetId) {
  const rows = unwrap(await supabase
    .from("comments")
    .select(COMMENT_COLUMNS)
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
    .select(COMMENT_COLUMNS)
    .single());
}

export async function updateComment(commentId, content) {
  return unwrap(await supabase
    .from("comments")
    .update({ content })
    .eq("id", Number(commentId))
    .select(COMMENT_COLUMNS)
    .single());
}

export async function deleteComment(commentId) {
  unwrap(await supabase.from("comments").delete().eq("id", Number(commentId)));
}
