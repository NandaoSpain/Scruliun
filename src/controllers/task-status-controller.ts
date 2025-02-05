import { prisma } from "@/database/prisma";
import { Request, Response } from "express";
import { z } from "zod";

class TaskStatusController {
  async update(request: Request, response: Response) {
    const bodySchema = z.object({
      status: z.enum(['pending', 'inProgress', 'completed'] as const),
    });
    const { id } = request.params;
    const { status } = request.body;
    const taskStatus = await prisma.tasks.findFirst({ where: { id: id }})
    const user = request.user.id

    if(taskStatus?.status === status){
      response.status(400).json({ message: "Task status is already in the desired state" });
      return;
    }
    console.log(taskStatus?.assignedTo, user)
    if(taskStatus?.assignedTo !== user){
      response.status(403).json({ message: "You are not authorized to update this task" });
      return;      
    }
    await prisma.tasks.update({ where: { id: id }, data: { status: status } });
    response.status(200).json({ message: "Task status updated" });
  }


}


export { TaskStatusController };
