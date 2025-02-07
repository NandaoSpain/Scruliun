import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
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
      throw new AppError("User not found", 404);
    }

    const teamData = await prisma.teams.findFirst({
      where: { name: { equals: team, mode: "insensitive" } },
    });

    if (!teamData) {
      throw new AppError("Team not found", 404);
    }

    const task = await prisma.tasks.create({
      data: {
        title,
        description,
        assignedTo: user.id,
        teamId: teamData.id,
      },
    });

    const taskHistoryCreate = await prisma.taskHistory.create({
      data: {
        changedBy: user.id,
        taskId: task.id,
        oldStatus: task.status,
        newStatus: task.status,
      },
    });

    response.json(task);
  }
  async index(request: Request, response: Response) {
    const tasks = await prisma.tasks.findMany();
    response.json(tasks);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const task = await prisma.tasks.findUnique({ where: { id: id } });
    if (!task) {
      throw new AppError("Task not found", 404);
    }
    response.json(task);
    return;
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const taskExists = await prisma.tasks.findFirst({ where: { id } });

    if (!taskExists) {
      throw new AppError("Task ID is invalid", 400);
    }

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
      throw new AppError("User not found", 404);
    }

    const teamData = await prisma.teams.findFirst({
      where: { name: { equals: team, mode: "insensitive" } },
    });

    if (!teamData) {
      throw new AppError("Team not found", 404);
    }

    const task = await prisma.tasks.update({
      where: { id: id },
      data: {
        title,
        description,
        assignedTo: user.id,
        teamId: teamData.id,
      },
    });

    const taskHistoryUpdate = await prisma.taskHistory.create({
      data: {
        changedBy: user.id,
        taskId: task.id,
        oldStatus: taskExists?.status,
        newStatus: task.status,
      },
    });

    response.json(task);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const taskExists = await prisma.tasks.findFirst({ where: { id: id } });
    if (!taskExists) {
      throw new AppError("Task ID is invalid", 400);
    }
    await prisma.tasks.delete({ where: { id: id } });
    response.status(204).json();
  }
}

export { TasksController };
