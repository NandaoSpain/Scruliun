import { Router } from "express"
import { TeamMembersController } from "@/controllers/team-members-controller"

const teamMembersRoutes = Router()
const teamMembersController = new TeamMembersController()

teamMembersRoutes.get("/", teamMembersController.indexTeams)
teamMembersRoutes.get("/:id", teamMembersController.indexTeamMembers)

export { teamMembersRoutes }