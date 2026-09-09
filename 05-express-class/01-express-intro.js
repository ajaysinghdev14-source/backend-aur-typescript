import express from "express";

function block_1_basicServer() {
  return new Promise((resolve) => {
    const app = express();
    app.use(express.json());

    app.get("/menu", (req, res) => {
      res.json({
        items: ["pizza", "burger", "cheese"],
      });
    });

    app.get("/search", (req, res) => {
      const { q, limit } = req.query;
      res.json({
        query: q,
        limit: limit || "10",
      });
    });

    app.get("/menu/:id", (req, res) => {
      const { id } = req.params;
      res.json({
        item: id,
        price: 149,
      });
    });

    app.post("/order", (req, res) => {
      const order = req.body;
      res.status(201).json({
        status: "created",
        order,
      });
    });

    const server = app.listen(0, async () => {
      const port = server.address().port;
      const base = `http://127.0.0.1:${port}`;

      try {
        const menuRes = await fetch(`${base}/menu`);
        const menuData = await menuRes.json();
        console.log("GET /menu", JSON.stringify(menuData));

        console.log("+++++++++++++++++++++++++++++++++++++++++++++");

        const searchResponse = await fetch(`${base}/search?q=biryani&limit=5`);
        const searchData = await searchResponse.json();
        console.log("GET /search", JSON.stringify(searchData));

        console.log("+++++++++++++++++++++++++++++++++++++++++++++");

        const menuItemResponse = await fetch(`${base}/menu/42`);
        const menuItemData = await menuItemResponse.json();
        console.log("GET /menu", JSON.stringify(menuItemData));

        console.log("+++++++++++++++++++++++++++++++++++++++++++++");

        const orderResponse = await fetch(`${base}/order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dish: "biryani",
            quantity: 2,
          }),
        });
        const orderData = await orderResponse.json();
        console.log("POST /order", JSON.stringify(orderData));
      } catch (error) {
        console.log(error);
      }

      server.close(() => {
        console.log(`Block 1 served....`);
        resolve();
      });
    });
  });
}

function block_2_response() {
  return new Promise((resolve) => {
    const app = express();

    app.get("/text", (req, res) => {
      res.send("Hello from chaicode");
    });

    app.get("/json", (req, res) => {
      res.json({
        framework: "express",
        version: "6.0.1",
      });
    });

    app.get("/not-found", (req, res) => {
      res.status(404).json({
        error: "Page not found",
      });
    });

    app.get("/health", (req, res) => {
      res.sendStatus(200);
    });

    app.get("/old-menu", (req, res) => {
      // add entry in DB to see how many users are still visiting old route
      res.redirect(301, "/new-menu");
    });

    app.get("/xml", (req, res) => {
      res
        .type("application/xml")
        .send(
          "<note><to>Tove</to>" +
            "<from>Jani</from><heading>Reminder</heading>" +
            "<body>",
        );
    });

    app.get("/custom-headers", (req, res) => {
      res.set("X-Request-ID", "1234-5678-9101");
      res.set("X-Content-Type-Options", "nosniff");
      res.json({
        message: "Custom headers set",
      });

      // CORS, caching, tracking, rate-limiting
    });

    app.get("/no-content", (req, res) => {
      res.status(204).end();
    });

    const server = app.listen(0, async () => {
      const port = server.address().port;
      const base = `http://127.0.0.1:${port}`;

      try {
        const textResponse = await fetch(`${base}/text`);
        const textData = await textResponse.text();
        console.log("GET /text", JSON.stringify(textData));

        console.log("+++++++++++++++++++++++++++++++++++++++++++++");

        const jsonResponse = await fetch(`${base}/json`);
        const jsonData = await jsonResponse.json();
        console.log("GET /json", JSON.stringify(jsonData));

        console.log("+++++++++++++++++++++++++++++++++++++++++++++");

        const notFoundResponse = await fetch(`${base}/not-found`);
        const notFoundData = await notFoundResponse.json();
        console.log("GET /not-found", JSON.stringify(notFoundData));

        console.log("+++++++++++++++++++++++++++++++++++++++++++++");

        const healthResponse = await fetch(`${base}/health`);
        const healthData = await healthResponse.text();
        console.log("GET /health", JSON.stringify(healthData));

        console.log("+++++++++++++++++++++++++++++++++++++++++++++");

        const oldMenuResponse = await fetch(`${base}/old-menu`);
        const oldMenuData = await oldMenuResponse.text();
        console.log("GET /old-menu", JSON.stringify(oldMenuData));

        console.log("+++++++++++++++++++++++++++++++++++++++++++++");

        const xmlResponse = await fetch(`${base}/xml`);
        const xmlData = await xmlResponse.text();
        console.log("GET /xml", JSON.stringify(xmlData));

        console.log("+++++++++++++++++++++++++++++++++++++++++++++");

        const customHeadersResponse = await fetch(`${base}/custom-headers`);
        const customHeadersData = await customHeadersResponse.json();
        console.log("GET /custom-headers", JSON.stringify(customHeadersData));

        console.log("+++++++++++++++++++++++++++++++++++++++++++++");

        const noContentResponse = await fetch(`${base}/no-content`);
        const noContentData = await noContentResponse.text();
        console.log("GET /no-content", JSON.stringify(noContentData));
      } catch (error) {
        console.log(error);
      }

      server.close(() => {
        console.log(`Block 2 served....`);
        resolve();
      });
    });
  });
}

async function main() {
  await block_1_basicServer();
  await block_2_response();
}

main();
