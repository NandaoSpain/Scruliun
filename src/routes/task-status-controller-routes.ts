import { Router } from "express"
import { TaskStatusController } from "@/controllers/task-status-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"

const taskStatusController = new TaskStatusController()

const taskStatusRoutes = Router()

taskStatusRoutes.patch("/:id", ensureAuthenticated, taskStatusController.update)

export { taskStatusRoutes }