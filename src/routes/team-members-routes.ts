import { Router } from "express"
import { TeamMembersController } from "@/controllers/team-members-controller"

const teamMembersRoutes = Router()
const teamMembersController = new TeamMembersController()

teamMembersRoutes.get("/:teamId", teamMembersController.indexTeamMembers)

export { teamMembersRoutes }