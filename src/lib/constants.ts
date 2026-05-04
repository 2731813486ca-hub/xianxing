export const UPLOAD_DIR = "public/uploads";
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ITEMS_PER_PAGE = 12;
export const TOP_WORKS_COUNT = 10;

export const POPULARITY_WEIGHTS = {
  LIKE: 1,
  FAVORITE: 3,
} as const;

export const ADMIN_EMAILS = ["admin@xianxing.app"];
