import { Router } from "express"
import { usersRoutes } from "./users-routes";
import { tasksRoutes } from "./tasks-controller-routes";
import { sessionsRoutes } from "./sessions-controller-routes";
import { teamsRoutes } from "./teams-controller-routes";
import { teamMembersRoutes } from "./team-members-routes";
import { taskStatusRoutes } from "./task-status-controller-routes";

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/tasks", tasksRoutes)
routes.use("/teams", teamsRoutes)
routes.use("/team-members", teamMembersRoutes)
routes.use("/task-status", taskStatusRoutes)


export { routes }
