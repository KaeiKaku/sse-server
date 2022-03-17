"use strict";

const express = require("express");
const cors = require("cors");
const app = express();

run().catch((err) => console.log(err));

async function run() {
  app.use(cors());

  app.get("/sse", async function (req, res) {
    res.set({
      "Cache-Control": "no-cache",
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
    });
    res.flushHeaders();

    let count = 0;

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Emit message", ++count);
      // Emit an SSE that contains the current 'count' as a string

      if (count < 5) {
        res.write("retry: 10000\n\n");
        res.write(`id: test id: ${count}\n\n`);
        // res.write("event: userdata\n");
        res.write(`data: { \"hello\": message type ${count} } \n\n`);
      } else if (count < 10) {
        res.write("retry: 10000\n\n");
        res.write(`id: test id: ${count}\n\n`);
        res.write("event: sselib_message\n");
        res.write(`data: { \"hello\": userdata type ${count} } \n\n`);
      } else if (count < 15) {
        res.write("retry: 10000\n\n");
        res.write(`id: test id: ${count}\n\n`);
        res.write("event: sselib_error\n");
        res.write(`data: { \"hello\": error type ${count} } \n\n`);
      } else {
        res.write("retry: 10000\n\n");
        res.write(`id: test id: ${count}\n\n`);
        res.write("event: error\n");
        res.write(`data: { \"hello\": error origin ${count} } \n\n`);
        break;
      }
    }
    console.log("over");
  });

  await app.listen(3000);
  console.log("Listening on port 3000");
}
