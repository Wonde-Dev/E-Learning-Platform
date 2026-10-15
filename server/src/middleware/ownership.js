import { ApiError } from "../utils/ApiError.js";

/**
 * ownership — middleware factory that ensures the current user
 * owns (or is admin of) the resource identified by a Mongoose model.
 *
 * Usage:
 *   router.patch("/:id", requireAuth, ownership(Course, "id"), controller.update);
 *   router.delete("/:id", requireAuth, ownership(Review, "id", "user"), controller.remove);
 *
 * @param {Model} Model   — Mongoose model to look up
 * @param {string} param  — req.params key (default "id")
 * @param {string} ownerField — field on the doc that must match req.user._id (default "user")
 */
export const ownership =
  (Model, param = "id", ownerField = "user") =>
  async (req, res, next) => {
    try {
      const doc = await Model.findById(req.params[param]);
      if (!doc) {
        return next(new ApiError(404, `${Model.modelName} not found`));
      }

      const isAdmin = req.user?.role === "admin";
      const isOwner =
        doc[ownerField] && String(doc[ownerField]) === String(req.user._id);

      if (!isAdmin && !isOwner) {
        return next(new ApiError(403, "Not your resource"));
      }

      req.doc = doc;
      next();
    } catch (err) {
      next(err);
    }
  };
