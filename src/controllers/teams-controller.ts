import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class TeamsController {
  async index(request: Request, response: Response): Promise<any> {
    const teams = await prisma.teams.findMany();

    if (!teams) {
      throw new AppError("No teams found", 404);
    }

    response.status(200).json(teams);
  }

  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim(),
      description: z.string(),
    });

    const { name, description } = bodySchema.parse(request.body);

    const team = await prisma.teams.create({
      data: { name, description },
    });
    response.status(200).json(team);
  }

  async update(request: Request, response: Response): Promise<any> {
    const { id } = request.params;
    const bodySchema = z.object({
      name: z.string().trim(),
      description: z.string(),
    });
    const { name, description } = bodySchema.parse(request.body);
    const teamExists = await prisma.teams.findFirst({ where: { id } });

    if (!teamExists) throw new AppError("Team not found", 404);

    const team = await prisma.teams.update({
      where: { id },
      data: { name, description },
    });

    response.status(200).json(team);
  }
  async delete(request: Request, response: Response): Promise<any> {
    const { id } = request.params;
    const teamExists = await prisma.teams.findUnique({
      where: { id },
      include: { Tasks: true },
    });
    if (!teamExists) {
      throw new AppError("Team not found", 404);
    }

    if (teamExists.Tasks.length > 0) {
      throw new AppError("Cannot delete team with associated tasks", 404);
    }
    await prisma.teams.delete({ where: { id } });

    response.status(200).json({ message: "Team deleted successfully" });
  }
  async show(request: Request, response: Response): Promise<any> {
    const { id } = request.params;

    const team = await prisma.teams.findUnique({
      where: { id },
      include: { TeamMembers: true, Tasks: true },
    });
    const role = request.user.role;
    console.log(role);
    if (role === "user") {
      const member = team?.TeamMembers.includes(request.body.id);
      if (!member) {
        throw new AppError("Unauthorized to access this team", 401);
      }
    }

    if (!team) {
      throw new AppError("Team not found", 401);
    }
    response.json(team);
    return;
  }
}
export { TeamsController };
