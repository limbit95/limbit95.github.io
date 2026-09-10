export const ROLE = Object.freeze({
  USER: "member",
  ADMIN: "admin",
  SYSTEM_ADMIN: "system_admin",
});

export const ADMIN_PERMISSION = Object.freeze({
  MEMBERS: "members",
  COMMUNITY: "community",
  GAMES: "games",
  CONTENT: "content",
  OPERATIONS: "operations",
  PERMISSIONS: "permissions",
  SYSTEM: "system",
});

export const ASSIGNABLE_ADMIN_PERMISSIONS = Object.freeze([
  { key: ADMIN_PERMISSION.MEMBERS, label: "회원 관리" },
  { key: ADMIN_PERMISSION.COMMUNITY, label: "커뮤니티 관리" },
  { key: ADMIN_PERMISSION.GAMES, label: "게임 관리" },
  { key: ADMIN_PERMISSION.CONTENT, label: "콘텐츠 관리" },
  { key: ADMIN_PERMISSION.OPERATIONS, label: "운영 관리" },
]);

export function hasAdminPermission(auth, permission) {
  return auth.isSystemAdmin || auth.adminPermissions?.has(permission) === true;
}

export function canManageActivityFor(auth, event) {
  return Boolean(event)
    && (event.created_by === auth.user?.id
      || hasAdminPermission(auth, ADMIN_PERMISSION.COMMUNITY)
      || auth.managerCategoryIds?.has(Number(event.category_id)) === true);
}
