import { prisma } from "@/database/prisma";
import { Request, Response } from "express";
import { z } from "zod";

class TaskStatusController {
  async update(request: Request, response: Response) {
    const bodySchema = z.object({
      status: z.enum(["pending", "inProgress", "completed"] as const),
    });
    const { id } = request.params;
    const { status } = bodySchema.parse(request.body)
    const task = await prisma.tasks.findFirst({ where: { id: id } });
    const userId = request.user.id;
    const userRole = request.user.role;

    if (userRole === "user") {
      if (task?.status === status) {
        response
          .status(400)
          .json({ message: "Task status is already in the desired state" });
        return;
      }
      if (task?.assignedTo !== userId) {
        response
          .status(403)
          .json({ message: "You are not authorized to update this task" });
        return;
      }
    }

    await prisma.tasks.update({ where: { id: id }, data: { status: status } });
    response.status(200).json({ message: "Task status updated" });
  }
}

export { TaskStatusController };
