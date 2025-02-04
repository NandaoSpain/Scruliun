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
      team: z.string().trim()
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

    const user = await prisma.users.create({
      data: { name, email, password: hashedPassword, team: teamData ? teamData.name : null },
    });

    const { password: _, ...userWithoutPassword  } = user;

    await prisma.teamMembers.update({
      where: { userId: user.id, teamId: teamData.id },
      data: { role: "ADMIN" },
    })

    response.status(201).json(userWithoutPassword);
  }


}

export { UsersController }
