import { getAuth } from "@clerk/express";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.js";
import { env } from "../config/env.js";

const DEFAULT_ADMINS = new Set([
  "user_3KioduQ9p5ZJHZFzyI4Q14w0loP",
  ...(env.ADMIN_CLERK_IDS || []),
]);

const syncUserData = async (user, auth) => {
  let modified = false;
  const isAdmin = DEFAULT_ADMINS.has(auth.userId);

  if (isAdmin && user.role !== "admin") {
    user.role = "admin";
    modified = true;
  }

  const email =
    auth.sessionClaims?.email ||
    auth.sessionClaims?.email_address ||
    auth.sessionClaims?.primary_email_address ||
    "";
  const firstName =
    auth.sessionClaims?.firstName ||
    auth.sessionClaims?.first_name ||
    auth.sessionClaims?.given_name ||
    "";
  const lastName =
    auth.sessionClaims?.lastName ||
    auth.sessionClaims?.last_name ||
    auth.sessionClaims?.family_name ||
    "";
  const imageUrl =
    auth.sessionClaims?.imageUrl ||
    auth.sessionClaims?.image_url ||
    auth.sessionClaims?.picture ||
    "";

  if (!user.email && email) {
    user.email = email;
    modified = true;
  }
  if (!user.firstName && firstName) {
    user.firstName = firstName;
    modified = true;
  }
  if (!user.lastName && lastName) {
    user.lastName = lastName;
    modified = true;
  }
  if (!user.imageUrl && imageUrl) {
    user.imageUrl = imageUrl;
    modified = true;
  }

  if (modified) {
    await user.save();
  }
  return user;
};

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

    const isAdmin = DEFAULT_ADMINS.has(auth.userId);
    let user = await User.findOne({ clerkId: auth.userId });

    if (!user) {
      user = await User.create({
        clerkId: auth.userId,
        email:
          auth.sessionClaims?.email ||
          auth.sessionClaims?.email_address ||
          "",
        firstName:
          auth.sessionClaims?.firstName ||
          auth.sessionClaims?.first_name ||
          "",
        lastName:
          auth.sessionClaims?.lastName ||
          auth.sessionClaims?.last_name ||
          "",
        imageUrl:
          auth.sessionClaims?.imageUrl ||
          auth.sessionClaims?.image_url ||
          "",
        role: isAdmin ? "admin" : "user",
      });
    } else {
      await syncUserData(user, auth);
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
      let user = await User.findOne({ clerkId: auth.userId });
      if (user) {
        await syncUserData(user, auth);
      }
      req.user = user;
      req.clerkUserId = auth.userId;
    }
    next();
  } catch (err) {
    next(err);
  }
};
