export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { dateStyle: "medium" }) : "";

export const formatRelativeTime = (d) => {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(d).toLocaleDateString();
};

export const initials = (first = "", last = "") =>
  `${first[0] || ""}${last[0] || ""}`.toUpperCase();