import { ApiError } from "../utils/ApiError.js";

/**
 * validate — Zod schema middleware.
 * Usage: validate(mySchema)                  // parses req.body
 *        validate(mySchema, "query")        // parses req.query
 *
 * The parsed output replaces the request data so controllers receive
 * only validated fields.
 */
export const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join(".") || property,
        message: e.message,
      }));
      return next(new ApiError(400, "Validation failed", errors));
    }

    req[property] = result.data;
    req.validated = result.data;
    next();
  };
