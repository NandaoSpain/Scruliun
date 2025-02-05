import { prisma } from "@/database/prisma";
import { Request, Response } from "express"

class TeamMembersController {
  async indexTeamMembers(request: Request, response: Response) {
    const { teamId } = request.params;
    
    if (!teamId) {
      response.status(400).json({ message: "Team ID is required!" });
      return;
    }
    
    const teamMembers = await prisma.teamMembers.findMany({ where: { teamId: String(teamId) }, 
    include: { user: {
      select: { name: true, email: true}
    } }});
    
    if (teamMembers.length < 1) {
      response.status(404).json({ message: "No members found for this team!" });
      return;
    }
    response.status(200).json(teamMembers);
  }

}

export { TeamMembersController };