import { prisma } from "@/database/prisma";
import { Request, Response } from "express"

class TeamMembersController {
  async indexTeams(request: Request, response: Response) {
    const teams = await prisma.teams.findMany()
    response.status(200).json(teams);
  }

  async indexTeamMembers(request: Request, response: Response) {
    const { teamId } = request.params;
    const teamMembers = await prisma.teamMembers.findMany({ where: { teamId } });
    console.log(teamMembers)
    response.status(200).json({ message: "ok"});
  }

}

export { TeamMembersController };