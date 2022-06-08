import "./style.css";

//const env = process.env.NODE_ENV;
const env = "development";

const serverAddress =
  env === "development"
    ? "http://localhost:4000"
    : "https://flea-market-game.herokuapp.com/api";

const getRumors = () => {
  fetch(`${serverAddress}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: "{ rumors {id, rumor_content, created_at} }",
    }),
  })
    .then((r) => r.json())
    .then((data) => console.log("data returned:", data));
};

//var author = "andy";
var content = "hope is a good thing";
var query = `mutation CreateMessage($input: MessageInput) {
  createMessage(input: $input) {
    id
  }
}`;

// const post = (input) => {
//   console.log(input);
//   fetch(`${serverAddress}/graphql`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//     body: JSON.stringify({ query, variables: { input } }),
//   });
// };

const post = (author) => {
  console.log(author);
  fetch(`${serverAddress}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        input: {
          author,
          content,
        },
      },
    }),
  })
    .then((r) => r.json())
    .then((data) => console.log("data returned:", data));
};

const button = document.getElementById("get-users");
const inputForm = document.getElementById("input-form");
const input = document.getElementById("input");

button.addEventListener("click", getRumors);
inputForm.addEventListener("submit", (e) => {
  //post(input.value);
  post(input.value);
  e.preventDefault();
  inputForm.reset();
  console.log("submit");
});
