import express from "express";

function block_1_middlewares() {
  return new Promise((resolve) => {
    const app = express();
    app.use(express.json());

    const logs = [];

    // request logger
    app.use((req, res, next, error) => {
      // add to the database
      // console log everything
      // write in some file
      // authenticate user

      const logEntry = `${req.method} ${req.path}`;
      logs.push(logEntry);
      console.log(`[log: ] -- ${logEntry}`);

      next();
    });

    app.use((req, res, next, error) => {
      req.startTime = Date.now();

      res.on("finish", () => {
        const duration = Date.now() - req.startTime;
        console.log(`[TIMER] - ${req.method} ${req.path} - ${duration}ms`);
      });

      next();
    });

    const server = app.listen(0, async () => {
      const port = server.address().port;
      const base = `http://127.0.0.1:${port}`;
      try {
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        server.close(() => {
          console.log("Block 1 served....");
          resolve();
        });
      }
    });
  });
}

async function main() {
  await block_1_middlewares();
}

main();
