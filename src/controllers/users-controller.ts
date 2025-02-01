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
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.users.findFirst({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError("Email already in use");
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.users.create({
      data: { name, email, password: hashedPassword },
    });

    const { password: _, ...userWithoutPassword } = user;

    response.status(201).json(userWithoutPassword);
  }
}

export { UsersController }
