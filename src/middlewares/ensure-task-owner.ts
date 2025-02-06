import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";
async function ensureTaskOwner(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { id } = request.params;
  const userId = request.user.id;
  const task = await prisma.tasks.findFirst({ where: { id: id } });

  if (!task) {
    throw new AppError("task not found", 404);
  }

  if (task.assignedTo !== userId) {
    throw new AppError("You are not authorized to update this task");
  }

  next();
}

export { ensureTaskOwner };
