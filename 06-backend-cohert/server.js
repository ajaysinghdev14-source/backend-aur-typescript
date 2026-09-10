import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/common/config/db.js";

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(
        `Server is running at ${PORT} in ${process.env.NODE_ENV} mode`,
      );
    });

    server.on("error", (error) => {
      console.error("Failed to start the server:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Application startup failed:", error);
    process.exit(1);
  }
};

start().catch((error) => {
  console.error("Unhandled startup error:", error);
  process.exit(1);
});
