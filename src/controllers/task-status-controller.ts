import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { z } from "zod";

class TaskStatusController {
  async update(request: Request, response: Response) {
    const bodySchema = z.object({
      status: z.enum(["pending", "inProgress", "completed"] as const),
    });
    const { id } = request.params;
    const { status } = bodySchema.parse(request.body);
    const task = await prisma.tasks.findFirst({ where: { id: id } });
    const userId = request.user.id;
    const userRole = request.user.role;

    if (userRole === "user") {
      if (task?.status === status) {
        throw new AppError("Task status is already in the desired state", 400);
      }
      if (task?.assignedTo !== userId) {
        throw new AppError("You are not authorized to update this task", 403);
      }
    }

    await prisma.tasks.update({ where: { id: id }, data: { status: status } });
    response.status(200).json({ message: "Task status updated" });
  }
}

export { TaskStatusController };
