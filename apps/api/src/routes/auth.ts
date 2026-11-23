import { Router } from "express";
import { loginSchema, loginUser, registerSchema, registerUser } from "../services/auth-service.js";
import type { AuthedRequest } from "../middleware/auth.js";
import { authenticate } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/auth/register", async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const user = await registerUser(body);
    res.status(201).json({
      user,
      message: "Registration received. An administrator must approve access before sign-in to protected areas.",
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/auth/login", async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const result = await loginUser(body);
    if (result.user.status !== "APPROVED") {
      res.status(200).json({
        token: result.token,
        user: result.user,
        access: result.user.status,
        message: `Account is ${result.user.status.toLowerCase()}. Protected workspace data remains locked.`,
      });
      return;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.get("/auth/me", authenticate, async (req: AuthedRequest, res) => {
  res.json({ user: req.user });
});
