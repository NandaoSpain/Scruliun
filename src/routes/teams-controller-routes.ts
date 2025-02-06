import { Router } from "express";
import { TeamsController } from "@/controllers/teams-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const teamsRoutes = Router();
const teamsController = new TeamsController();

teamsRoutes.use(ensureAuthenticated);
teamsRoutes.get("/", teamsController.index);
teamsRoutes.get("/:id", teamsController.show);
teamsRoutes.post(
  "/",
  verifyUserAuthorization(["admin"]),
  teamsController.create
);
teamsRoutes.patch(
  "/:id",
  verifyUserAuthorization(["admin"]),
  teamsController.update
);
teamsRoutes.delete(
  "/:id",
  verifyUserAuthorization(["admin"]),
  teamsController.delete
);

export { teamsRoutes };
