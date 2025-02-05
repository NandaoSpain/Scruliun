import { Router } from "express";
import { TaskPriorityController } from "@/controllers/task-priority-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";

const taskPriorityRoutes = Router();

const taskPriorityController = new TaskPriorityController();

taskPriorityRoutes.patch(
  "/:id",
  ensureAuthenticated,
  taskPriorityController.update
);

export { taskPriorityRoutes };
