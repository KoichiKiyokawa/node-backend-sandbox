import { app } from "~/lib/app";
import { userService } from "./user.service";

app.get("/users", async (_req, res) => {
  res.json(await userService.findAll());
});

app.get("/users/:id", async (req, res) => {
  res.json(await userService.find(Number(req.params.id)));
});

app.get("/users/:id/rooms", async (req, res) => {
  res.json(await userService.findJoinedRooms(Number(req.params.id)));
});
