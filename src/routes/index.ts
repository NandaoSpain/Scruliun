import { Router } from "express"
import { usersRoutes } from "./users-routes";

const routes = Router()

routes.use("/users", () => {
  throw new Error("test error: missing")
}, usersRoutes)

export { routes }
