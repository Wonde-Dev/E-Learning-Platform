/**
 * asyncHandler — wraps an async route handler so rejections are forwarded to next().
 * Usage: export const myHandler = asyncHandler(async (req, res) => { ... });
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export { asyncHandler };
