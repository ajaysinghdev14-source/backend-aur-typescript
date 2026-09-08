import type { Application } from "express";
import express from "express";

export function createServerApplication(): Application {
  const app = express();

  app.get("/", function (req, res) {
    return res.json({ message: "Hello World!" });
  });

  return app;
}
