import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";

class TeamsController {
  async index(request: Request, response: Response): Promise<any> {
    const teams = await prisma.teams.findMany();

    if (!teams) {
      return response.status(404).json({ message: "No teams found" });
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

    if (!teamExists)
      return response.status(404).json({ message: "Team not found" });

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
      return response.status(404).json({ message: "Team not found" });
    }

    if (teamExists.Tasks.length > 0) {
      return response
        .status(400)
        .json({ message: "Cannot delete team with associated tasks" });
    }
    await prisma.teams.delete({ where: { id } });

    response.status(200).json({ message: "Team deleted successfully" });
  }
}
export { TeamsController };
