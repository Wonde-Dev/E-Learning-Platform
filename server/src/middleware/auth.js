import { getAuth } from "@clerk/express";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.js";

/**
 * requireAuth — Express middleware that authenticates via Clerk and
 * attaches the full Mongoose user to `req.user`.
 *
 * Clerk's `clerkMiddleware()` must run earlier in the chain (in app.js)
 * so that `getAuth(req)` resolves the session.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) {
      return next(new ApiError(401, "Authentication required"));
    }

    let user = await User.findOne({ clerkId: auth.userId });

    if (!user) {
      user = await User.create({
        clerkId: auth.userId,
        email: auth.sessionClaims?.email || "",
        firstName: auth.sessionClaims?.firstName || "",
        lastName: auth.sessionClaims?.lastName || "",
        imageUrl: auth.sessionClaims?.imageUrl || "",
        role: "user",
      });
    }

    req.user = user;
    req.clerkUserId = auth.userId;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * optionalAuth — like requireAuth but does NOT reject unauthenticated
 * requests; it simply attaches the user when available.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    if (auth?.userId) {
      const user = await User.findOne({ clerkId: auth.userId });
      req.user = user;
      req.clerkUserId = auth.userId;
    }
    next();
  } catch (err) {
    next(err);
  }
};
