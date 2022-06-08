const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./queries");

const env = process.env.NODE_ENV;
const app = express();
const PORT = 4000;

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

// send static client files here when in prod
env === "production" &&
  app.use(express.static(path.resolve(__dirname, "../client/public")));

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
input dataInput {
  name: String,
  email: String
}

input MessageInput {
  content: String
  author: String
}

type Message {
  id: ID!
  content: String
  author: String
}

type Mutation {
  createMessage(input: MessageInput): Message
}

type Query {
  rumors: [rumor],
}

type rumor {
  id: Int,
  rumor_content: String,
  created_at: String,
}
`);

// If Message had any complex fields, we'd put them on this object.
class Message {
  constructor(id, { content, author }) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}
// Maps username to content
var fakeDatabase = {};

const root = {
  rumors: () => {
    return db.getRumors();
  },
  input: ({ input }) => {
    console.log("input: ", input);
    db.createUser({ name: "z", email: "zz" });
    return "z";
  },

  createMessage: ({ input }) => {
    console.log("hi: ", input);
    const { content, author } = input;
    console.log("content: ", content);
    console.log("author: ", author);

    db.createUser({ name: content, email: author });
    //Create a random id for our "database".

    // var id = require("crypto").randomBytes(10).toString("hex");

    // fakeDatabase[id] = input;
    // console.log(fakeDatabase);
    // return new Message(id, input);
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

// app.get("/users", db.getUsers);
// app.post("/users", db.createUser);

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
