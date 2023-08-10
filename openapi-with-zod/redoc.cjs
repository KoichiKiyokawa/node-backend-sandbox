const express = require("express");
const redoc = require("redoc-express");

const app = express();
const port = 3000;

// serve your swagger.json file
app.get("/doc/openapi.json", (_req, res) => {
  res.sendFile("openapi.json", { root: "." });
});

// define title and specUrl location
// serve redoc
app.get(
  "/",
  redoc({
    title: "API Docs",
    specUrl: "/doc/openapi.json",
    nonce: "", // <= it is optional,we can omit this key and value
    // we are now start supporting the redocOptions object
    // you can omit the options object if you don't need it
    // https://redocly.com/docs/api-reference-docs/configuration/functionality/
    redocOptions: {
      theme: {
        colors: {
          primary: {
            main: "#6EC5AB",
          },
        },
        typography: {
          fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
          fontSize: "15px",
          lineHeight: "1.5",
          code: {
            code: "#87E8C7",
            backgroundColor: "#4D4D4E",
          },
        },
        menu: {
          backgroundColor: "#ffffff",
        },
      },
    },
  })
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
