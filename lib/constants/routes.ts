export const ROUTES = {
  ROOT: '/',
  MAIN: '/main',
  LOGIN: '/login',
  SIGN_UP: '/sign-up',
  FIND_PASSWORD: '/find-password',
  FIND_ID: '/find-id',
  HELPS: '/helps',
  HELPS_CREATE: '/helps/create',
  HELPS_DETAIL: (helpId: string | number) => `/helps/${helpId}`,
  HELPS_APPLICANTS: (helpId: string | number) => `/helps/${helpId}/applicants`,
  HELPS_CREATE_REVIEW: (helpId: string | number) =>
    `/helps/${helpId}/create-review`,
  CHATS: '/chats',
  CHATS_ROOM: (roomId: string | number) => `/chats/${roomId}`,
  CHATS_ROOM_HISTORY: (roomId: string | number) => `/chats/${roomId}/history`,
  USER_PROFILE: (nickname: string) => `/user/profile/${nickname}`,
  USER_PROFILE_SETTINGS: (nickname: string) =>
    `/user/profile/${nickname}/settings`,
  USER_PROFILE_HALL_OF_FAME: '/user/hall-of-fame',
  USER_PROFILE_WITHDRAWAL: '/user/profile/withdrawal',
  TEST_VERIFICATION: '/test/verification',
} as const;
