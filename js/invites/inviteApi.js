export function createInviteClient(supabase) {
  if (!supabase?.rpc) throw new Error("Supabase client is required.");

  async function rpc(name, params = {}) {
    const { data, error } = await supabase.rpc(name, params);
    if (error) throw error;
    return data;
  }

  return {
    createInvite({ targetType, targetId, expiresInMinutes = 1440, metadata = {} }) {
      return rpc("site_invite_create", {
        p_target_type: targetType,
        p_target_id: targetId,
        p_expires_in_minutes: expiresInMinutes,
        p_metadata: metadata,
      });
    },
    resolveInvite(token) {
      return rpc("site_invite_resolve", { p_token: token });
    },
    revokeInvite(token) {
      return rpc("site_invite_revoke", { p_token: token });
    },
  };
}
