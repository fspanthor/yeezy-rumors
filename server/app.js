const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const path = require("path");
const cors = require("cors");

const env = process.env.NODE_ENV;
const app = express();
const PORT = 4000;

app.use(
  cors({
    origin: "http://localhost:9000",
  })
);

// send static client files here when in prod
env === "production" &&
  app.use(express.static(path.resolve(__dirname, "../client/public")));

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
type Query {
  hello: String
}`);

const root = {
  hello: () => {
    return "Hello world";
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
