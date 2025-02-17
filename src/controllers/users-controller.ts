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
      role: z.string().trim()
    });

    const { name, email, password, team, role } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.users.findUnique({
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
        role: request.body.role
      },
    });

    await prisma.teamMembers.create({
      data: {
        userId: user.id,
        teamId: teamData.id,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    response.status(200).json(userWithoutPassword);
  }
  async index(request: Request, response: Response) {
    const users = await prisma.users.findMany();

    const usersWithoutPassword = users.map(
      ({ password, ...usersWithoutPassword }) => usersWithoutPassword
    );

    response.json(usersWithoutPassword);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new AppError("User not found", 404);
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
      throw new AppError("User not found", 404);
    }
    if (userExists.Tasks.length > 0) {
      throw new AppError("This user have tasks open", 404);
    }
    await prisma.teamMembers.deleteMany({
      where: { userId: id },
    });
    await prisma.users.delete({ where: { id } });
    response.status(204).send();
  }
}

export { UsersController };
