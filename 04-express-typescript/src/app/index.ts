import type { Application } from "express";
import express from "express";

export function createServerApplication(): Application {
  return express();
}
