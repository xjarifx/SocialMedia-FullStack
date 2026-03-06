import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

export const bootstrapEnv = (): void => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const envPath = path.resolve(__dirname, "../../.env");
  dotenv.config({ path: envPath });
};
