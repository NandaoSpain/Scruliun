import { prisma } from "@/database/prisma";
import { Request, Response } from "express";
import { z } from "zod";

class TasksController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z.string().min(3).max(255),
      description: z.string().min(10).max(2000),
      assignedTo: z.string(),
      team: z.string(),
    });
    const { title, description, assignedTo, team } = bodySchema.parse(
      request.body
    );

    const user = await prisma.users.findFirst({
      where: { name: { equals: assignedTo, mode: "insensitive" } },
    });

    if (!user) {
      response.status(400).json({ message: "User not found" });
      return
    }

    const teamData = await prisma.teams.findFirst({
      where: { name: { equals: team, mode: "insensitive" } },
    });

    if (!teamData) {
      response.status(400).json({ message: "Team not found" });
      return
    }

    const task = await prisma.tasks.create({
      data: {
        title,
        description,
        assignedTo: user.id,
        teamId: teamData.id,
      },
    });
    response.json(task);
  }
}

export { TasksController };
