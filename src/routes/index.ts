import { Router } from "express"
import { usersRoutes } from "./users-routes";
import { tasksRoutes } from "./tasks-controller-routes";
import { sessionsRoutes } from "./sessions-controller-routes";

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/tasks", tasksRoutes)


export { routes }
