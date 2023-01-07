import "~/features/room/room.route";
import "~/features/user/user.route";
import { app } from "~/lib/app";

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log("Listening on http://localhost:3000");
});
