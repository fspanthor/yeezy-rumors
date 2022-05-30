import "./style.css";

console.log("zzz");

//const env = process.env.NODE_ENV;
const env = "development";

const serverAddress =
  env === "development"
    ? "http://localhost:4000"
    : "https://flea-market-game.herokuapp.com/api";

fetch(`${serverAddress}/graphql`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({ query: "{ hello }" }),
})
  .then((r) => r.json())
  .then((data) => console.log("data returned:", data));

console.log("hi");
