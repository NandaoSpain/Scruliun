import { Router } from "express";
import { TasksController } from "@/controllers/tasks-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const tasksRoutes = Router();

const tasksController = new TasksController();

tasksRoutes.use(ensureAuthenticated);
tasksRoutes.get("/", tasksController.index);
tasksRoutes.post("/", tasksController.create);
tasksRoutes.put("/:id", tasksController.show);
tasksRoutes.delete("/:id", tasksController.delete);
tasksRoutes.patch(
  "/:id",
  verifyUserAuthorization(["admin"]),
  tasksController.update
);

export { tasksRoutes };
