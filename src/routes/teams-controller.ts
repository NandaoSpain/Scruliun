import { Router } from "express";
import { TeamsController } from "@/controllers/teams-controller";

const teamsRoutes = Router()
const teamsController = new TeamsController()

teamsRoutes.post("/", teamsController.create)
teamsRoutes.patch("/:id", teamsController.update)

export { teamsRoutes }
