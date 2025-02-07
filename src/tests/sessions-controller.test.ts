import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/database/prisma";

describe("SessionsController", () => {
  let user_id: string;
  let adminId: string

  afterAll(async () => {
    if (user_id) {
      await prisma.teamMembers.deleteMany({ where: { userId: user_id } });
      await prisma.users.delete({ where: { id: user_id } });
    }
    if (adminId) {
      await prisma.teamMembers.deleteMany({ where: { userId: adminId } })
      await prisma.users.delete({ where: { id: adminId } });
    }
  });

  it("should authenticate and get access token", async () => {
    const userResponse = await request(app).post("/users").send({
      name: "test1234567",
      email: "test1234567@example.com",
      password: "password321",
      team: "verde",
      role: "user"
    });

    user_id = userResponse.body.id;
    expect(userResponse.status).toBe(200);

    const sessionResponse = await request(app).post("/sessions").send({
      email: "test1234567@example.com",
      password: "password321",
    });

    expect(sessionResponse.status).toBe(200);
    expect(sessionResponse.body.token).toEqual(expect.any(String));
  });

  it("should list users", async () => {
    const adminUserResponse = await request(app).post("/users").send({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      team: "verde",
      role: "admin"
    });

    adminId = adminUserResponse.body.id
    expect(adminUserResponse.status).toBe(200); 
    const sessionResponse = await request(app).post("/sessions").send({
        email: "admin@example.com",
        password: "admin123",
    });

    expect(sessionResponse.status).toBe(200);

    const token = sessionResponse.body.token;
    expect(token).toEqual(expect.any(String));

    const usersResponse = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${token}`);

    expect(usersResponse.status).toBe(200);
    expect(Array.isArray(usersResponse.body)).toBe(true);
  });
});
