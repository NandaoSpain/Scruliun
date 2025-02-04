import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";

class TeamsController {
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
    const team = await prisma.teams.update({
      where: { id },
      data: { name, description },
    });
    const teamExists = await prisma.teams.findFirst({ where: { id } });

    if (!teamExists)
      return response.status(404).json({ message: "Team not found" });

    response.status(200).json(team);
  }
}
export { TeamsController };
