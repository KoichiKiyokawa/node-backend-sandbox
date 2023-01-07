import { app } from "~/lib/app";
import { roomService } from "./room.service";

app.get("/rooms/:id", async (req, res) => {
  res.json(await roomService.find(Number(req.params.id)));
});
