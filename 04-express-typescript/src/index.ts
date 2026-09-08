import http from "node:http";
import { env } from "./env.js";

async function main() {
  try {
    const server = http.createServer();
    const PORT: number = env.PORT ? +env.PORT : 8080;

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
}

main();
