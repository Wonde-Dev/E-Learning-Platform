/**
 * slugify — converts a string into a URL-safe slug.
 * e.g. "Modern React with Vite!" -> "modern-react-with-vite"
 */
export const slugify = (str) =>
  str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[#%&?:'"{}|\^`]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+([\w-]+)*/g, (m, chr) => (chr ? "-" + chr : ""))
    .replace(/^-+|-+$/g, "");

export default slugify;
