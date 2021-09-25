import express from "express";
import { join } from "path";
import history from "connect-history-api-fallback";
import serveStatic from "serve-static";

var app = express();
app.use(history());
app.use(serveStatic(join(__dirname, "dist")));

var port = process.env.PORT || 5000;
app.listen(port);
console.log("server started " + port);
