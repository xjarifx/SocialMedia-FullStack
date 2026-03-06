import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware";
import { generalLimiter } from "../../middleware/rateLimit.middleware";
import { follow, unfollow } from "./follow.controller";

const router = Router({ mergeParams: true });

router.post("/", generalLimiter, authenticate, follow);
router.delete("/:followingId", generalLimiter, authenticate, unfollow);

export default router;
