import { app } from "~/lib/app";
import { userService } from "./user.service";

app.get("/users", async (req, res) => {
  res.json(await userService.findAll());
});
