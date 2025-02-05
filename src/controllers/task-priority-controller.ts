import { prisma } from "@/database/prisma";
import { Request, Response } from "express";
import { z } from "zod";

class TaskPriorityController {
  async update(request: Request, response: Response) {
    const { id } = request.params;

    const user = request.user;
    const task = await prisma.tasks.findFirst({ where: { id: id } });

    const bodySchema = z.object({
      priority: z.enum(["low", "medium", "high"]),
    });
    const { priority } = bodySchema.parse(request.body);

    if (user.role === "user") {
      if (task?.assignedTo !== user.id) {
        response
          .status(403)
          .json({ message: "You are not authorized to update this task" });
      }

      if (task?.priority === priority) {
        response.status(400).json({
          message: "Priority must be different from current priority",
        });
        return;
      }
    }

    await prisma.tasks.update({
      where: { id },
      data: { priority },
    });
    response
      .status(200)
      .json({ message: "Task priority updated successfully" });
  }
}

export { TaskPriorityController };
