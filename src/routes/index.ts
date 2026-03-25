import { Router } from "express";
import registerRoutes from "./register";
import loginRoutes from "./login";
import refreshTokenRoutes from "./refresh-token";
import signoutRoutes from "./signout";
import userRoutes from "./user";
import todosRoutes from "./todos";
import recipesRoutes from "./recipes";

const router = Router();

router.use("/register", registerRoutes);
router.use("/login", loginRoutes);
router.use("/refresh-token", refreshTokenRoutes);
router.use("/signout", signoutRoutes);
router.use("/user", userRoutes);
router.use("/todos", todosRoutes);
router.use("/recipes", recipesRoutes); // spoonacular

export default router;
