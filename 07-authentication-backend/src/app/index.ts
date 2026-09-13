import express from "express";

export function createExpressApplication(): express.Express {
  // Create and configure the Express application instance.
  const app = express();

  // Add shared middleware here, such as JSON body parsing.

  // Define the application's API routes.
  app.get("/", (req, res) => {
    // Return a simple response to confirm the server is running.
    return res.json({ message: "Hello, world!" });
  });

  // Return the configured application for the server to start.
  return app;
}
