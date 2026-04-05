const viDateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const viDateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(value?: string | Date | null) {
  if (!value) {
    return "Đang cập nhật";
  }

  return viDateFormatter.format(new Date(value));
}

export function formatDateTime(value?: string | Date | null) {
  if (!value) {
    return "Đang cập nhật";
  }

  return viDateTimeFormatter.format(new Date(value));
}
