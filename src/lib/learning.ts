import type { ContentStatus, DifficultyLevel, Platform } from "@prisma/client";

export function getPlatformLabel(platform: Platform) {
  switch (platform) {
    case "FACEBOOK_ADS":
      return "Facebook Ads";
    case "TIKTOK_ADS":
      return "TikTok Ads";
    case "SHOPEE_ADS":
      return "Shopee Ads";
    case "CROSS_PLATFORM":
      return "Cross-platform";
    default:
      return platform;
  }
}

export function getLevelLabel(level: DifficultyLevel) {
  switch (level) {
    case "BEGINNER":
      return "Cơ bản";
    case "INTERMEDIATE":
      return "Trung cấp";
    case "ADVANCED":
      return "Nâng cao";
    default:
      return level;
  }
}

export function getContentStatusLabel(status: ContentStatus) {
  switch (status) {
    case "DRAFT":
      return "Draft";
    case "PUBLISHED":
      return "Published";
    case "ARCHIVED":
      return "Archived";
    default:
      return status;
  }
}

export function formatMinutes(minutes?: number | null) {
  if (!minutes) {
    return "Đang cập nhật";
  }

  return `${minutes} phút`;
}

export function formatHours(hours?: number | null) {
  if (!hours) {
    return "Đang cập nhật";
  }

  return `${hours} giờ`;
}
