const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000);
