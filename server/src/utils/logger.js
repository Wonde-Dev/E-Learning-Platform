import { env } from "../config/env.js";

const ts = () => new Date().toISOString();

export const logger = {
  info: (...a) => console.log(`[INFO ${ts()}]`, ...a),
  warn: (...a) => console.warn(`[WARN ${ts()}]`, ...a),
  error: (...a) => console.error(`[ERROR ${ts()}]`, ...a),
  debug: (...a) => !env.isProd && console.log(`[DEBUG ${ts()}]`, ...a),
};