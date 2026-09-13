import http from "node:http";

async function main() {
  try {
    // Create the HTTP server that will handle authentication requests.
    const server = http.createServer();

    // Keep the port in one place so it is easy to change for another environment.
    const port: number = 3000;

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    // Report startup failures instead of leaving them unhandled.
    console.error("Failed to start the authentication server:", error);
  }
}

main();
