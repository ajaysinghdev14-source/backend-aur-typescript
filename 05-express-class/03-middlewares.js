import express from "express";

function block_1_middlewares() {
  return new Promise((resolve) => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(
      express.static(root, {
        dotfiles: "ignore",
        maxAge: 0,
      }),
    );

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

    function authMe(req, res, next) {
      const token = req.headers["x-auth-token"];
      if (!token) return res.status(401).json({ error: "no token provided" });

      if (token !== "secret-chaicode")
        return res.status(403).json({ error: "invalid token" });

      // token -> extract data from token
      req.user = { id: 1, name: "mike", role: "admin" };

      next();
    }

    function getRole(role) {
      return (req, res, next) => {
        if (!req.user || req.user.role !== role)
          return res.status(403).json({ error: "forbidden" });

        next();
      };
    }

    function rateLimit(maxRequest) {
      let count = 0;

      return (req, res, next) => {
        count++;
        if (count > maxRequest) {
          return res.status(429).json({ error: "too many requests" });
        }
        next();
      };
    }

    const limitedEndPoint = rateLimit(5);

    app.get("/limited", limitedEndPoint, (req, res) => {});

    app.get("/profile", authMe, getRole("admin"), () => {}); // this is the way to use middlewares

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
