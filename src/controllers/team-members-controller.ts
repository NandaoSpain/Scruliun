import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";

class TeamMembersController {
  async indexTeamMembers(request: Request, response: Response) {
    const { teamId } = request.params;

    if (!teamId) {
      throw new AppError("Team ID is required!", 400);
    }

    const teamMembers = await prisma.teamMembers.findMany({
      where: { teamId: String(teamId) },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (teamMembers.length < 1) {
      throw new AppError("No members found for this team!", 404);
    }
    response.status(200).json(teamMembers);
  }
}

export { TeamMembersController };
