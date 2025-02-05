import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";
import { z } from "zod";
import { AppError } from "@/utils/AppError";

class UsersController {
  async create(request: Request, response: Response): Promise<void> {
    const bodySchema = z.object({
      name: z.string().trim().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      team: z.string().trim(),
    });

    const { name, email, password, team } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.users.findFirst({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError("Email already in use");
    }

    const hashedPassword = await hash(password, 8);

    const teamData = await prisma.teams.findFirst({
      where: { name: { equals: team, mode: "insensitive" } },
    });

    if (!teamData) {
      throw new AppError("Team not found", 404);
    }

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        team: teamData ? teamData.name : null,
      },
    });

    await prisma.teamMembers.create({
      data: {
        userId: user.id,
        teamId: teamData.id,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    response.status(201).json(userWithoutPassword);
  }
  async index(request: Request, response: Response) {
    const users = await prisma.users.findMany();
    response.json(users);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      response.status(404).json({ message: "User not found" });
      return;
    }
    response.json(user);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const userExists = await prisma.users.findFirst({
      where: { id },
      include: { TeamMembers: true, Tasks: true },
    });
    if (userExists?.id === request.user.id) {
      throw new AppError("You can't delete yourself", 403);
    }
    if (!userExists) {
      response.status(404).json({ message: "User not found" });
      return;
    }
    if(userExists.Tasks.length > 0) {
      response.status(403).json({ message: "This user have tasks open"})
    }
    await prisma.teamMembers.deleteMany({
      where: { userId: id },
    })
    await prisma.users.delete({ where: { id } });
    response.status(204).send();
  }
}

export { UsersController };
