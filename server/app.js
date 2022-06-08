const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const { Server } = require("socket.io");
const { createServer } = require("http");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./queries");

const env = process.env.NODE_ENV;
const app = express();
const http = require("http");
const PORT = 4000;

const server = http.createServer(app);
const io = new Server(server);

app.use(
  cors({
    origin: "http://localhost:9000",
  })
);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

io.on("connection", (socket) => {
  console.log("socket id: ", socket.id);
});

// send static client files here when in prod
env === "production" &&
  app.use(express.static(path.resolve(__dirname, "../client/public")));

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
scalar Date

type Query {
  rumors: [Rumor],
}

type Mutation {
  createRumor(input: RumorInput): Rumor
}

type Rumor {
  id: Int,
  rumor_content: String,
  created_at: Date,
}

input RumorInput {
  content: String
}
`);

//defined resolvers
const root = {
  rumors: () => {
    return db.getRumors();
  },
  createRumor: ({ input }) => {
    const { content } = input;
    if (content.length > 0) {
      const res = db.createRumor({ rumorContent: content });
      return res;
    } else {
      return;
    }
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

server.listen(PORT, (error) => {
  if (!error) console.log("App listening on port: " + PORT);
  else console.log("Error occurred: ", error);
});
