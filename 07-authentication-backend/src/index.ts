import http from "node:http";
import { createExpressApplication } from "./app/index.js";

async function main() {
  try {
    // Create the HTTP server that will handle authentication requests.
    const server = http.createServer(createExpressApplication());

    // Keep the port in one place so it is easy to change for another environment.
    const port: number = 8080;

    server.listen(port, () => {
      console.log(`Authentication API listening at http://localhost:${port}`);
    });
  } catch (error) {
    // Report startup failures instead of leaving them unhandled.
    console.error("Failed to start the authentication server:", error);
  }
}

main();
