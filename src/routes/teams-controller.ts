import { Router } from "express";
import { TeamsController } from "@/controllers/teams-controller";

const teamsRoutes = Router()
const teamsController = new TeamsController()

teamsRoutes.get("/", teamsController.index)
teamsRoutes.post("/", teamsController.create)
teamsRoutes.patch("/:id", teamsController.update)
teamsRoutes.delete("/:id", teamsController.delete)

export { teamsRoutes }
