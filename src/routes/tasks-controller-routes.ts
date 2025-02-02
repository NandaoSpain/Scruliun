import { Router } from "express"
import { TasksController } from "@/controllers/tasks-controller"

const tasksRoutes = Router()

const tasksController = new TasksController()

tasksRoutes.get("/", tasksController.index)
tasksRoutes.post("/", tasksController.create)
tasksRoutes.put("/:id", tasksController.show)

export { tasksRoutes }