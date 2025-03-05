import { config } from "std";
import { cleanEnv, url } from "envalid";

await config({ export: true });

export default cleanEnv(Deno.env.toObject(), {
  MONGO_URL: url(),
});
