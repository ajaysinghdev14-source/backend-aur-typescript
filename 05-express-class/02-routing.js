import express from "express";

function block_1_httpMethods() {
  return new Promise((resolve) => {
    const app = express();

    app.use(express.json());

    const routes = {
      1: {
        id: 1,
        name: "Dadar -Andhri Express",
        direction: "north",
      },
      2: {
        id: 2,
        name: "Worli - Thane Local",
        direction: "south",
      },
      3: {
        id: 3,
        name: "Andheri - Bandra Fast",
        direction: "east",
      },
    };

    let nextId = 4;

    // list all trains
    app.get("/routes", (req, res) => {
      res.json(Object.values(routes));
    });

    // single route by id
    app.get("/routes/:id", (req, res) => {
      const route = routes[req.params.id];
      if (!route)
        return res.status(404).json({ error: "Route not found", found: false });
      return res.json(route);
    });

    // add new routes
    app.post("/routes", (req, res) => {
      const newRoute = { id: nextId++, ...req.body };
      routes[newRoute.id] = newRoute;
      res.status(201).json({ status: "created", route: newRoute });
    });

    // update entire route
    app.put("/routes/:id", (req, res) => {
      const id = req.params.id;
      if (!routes[id]) {
        return res.status(404).json({ error: "route not found" });
      }

      routes[id] = { id: Number(id), ...req.body };
      return res.json({ status: "updated", route: routes[id] });
    });

    // partial update of a route
    app.patch("/routes/:id", (req, res) => {
      const id = req.params.id;
      if (!routes[id]) {
        return res.status(404).json({ error: "route not found" });
      }

      const currentRoute = routes[id];
      const updatedRoute = { ...currentRoute, ...req.body };
      routes[id] = updatedRoute;
      return res.json({ status: "updated", route: updatedRoute });
    });

    // delete a route
    app.delete("/routes/:id", (req, res) => {
      const id = req.params.id;
      if (!routes[id]) {
        return res.status(404).json({ error: "route not found" });
      }
      delete routes[id];
      return res.json({ status: "deleted" });
    });

    const server = app.listen(0, async () => {
      const port = server.address().port;
      const base = `http://127.0.0.1:${port}`;

      try {
        // list all trains
        const listResponse = await fetch(`${base}/routes`);
        const listData = await listResponse.json();
        console.log("GET /routes", JSON.stringify(listData));

        console.log("+++++++++++++++++++++++++++++++++++++++++++++");

        // single route by id

        const getResponse = await fetch(`${base}/routes/1`);
        const getData = await getResponse.json();
        console.log("GET /routes/:id", JSON.stringify(getData));

        console.log("+++++++++++++++++++++++++++++++++++++++++++++");

        const postResponse = await fetch(`${base}/routes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Thane - Vashi Local",
            direction: "south",
          }),
        });
        const postData = await postResponse.json();
        console.log("POST /routes", JSON.stringify(postData));

        console.log("+++++++++++++++++++++++++++++++++++++++++++++");

        const putResponse = await fetch(`${base}/routes/1`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Thane - Vashi Local",
            direction: "south",
          }),
        });
        const putData = await putResponse.json();
        console.log("PUT /routes/:id", JSON.stringify(putData));

        console.log("+++++++++++++++++++++++++++++++++++++++++++++");

        const patchResponse = await fetch(`${base}/routes/1`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Thane - Vashi Local",
            direction: "south",
          }),
        });
        const patchData = await patchResponse.json();
        console.log("PATCH /routes/:id", JSON.stringify(patchData));

        console.log("+++++++++++++++++++++++++++++++++++++++++++++");

        const deleteResponse = await fetch(`${base}/routes/1`, {
          method: "DELETE",
        });
        const deleteData = await deleteResponse.json();
        console.log("DELETE /routes/:id", JSON.stringify(deleteData));
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        server.close(() => resolve());
      }
    });
  });
}

function block_2_more_httpMethods() {
  return new Promise((resolve) => {
    const app = express();
    app.use(express.json());

    // wildcard routes
    app.get("/files/*filepath", (req, res) => {
      const filepath = req.params.filepath;
      res.json({ filepath, type: "wildcard" });
    });

    app
      .route("/schedule")
      .get((req, res) => {})
      .post((req, res) => {})
      .put((req, res) => {})
      .patch((req, res) => {})
      .delete((req, res) => {});

    app.use("/api", (req, res) => {
      // it's a prefected match
    });

    const server = app.listen(0, async () => {
      const port = server.address().port;
      const base = `http://127.0.0.1:${port}`;
      try {
      } catch (error) {}
    });
  });
}

async function main() {
  await block_1_httpMethods();
}

main();
