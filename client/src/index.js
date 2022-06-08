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

const query = `mutation CreateRumor($input: RumorInput) {
  createRumor(input: $input) {
    id
  }
}`;

const createRumor = (content) => {
  if (content.length > 0) {
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
            content,
          },
        },
      }),
    })
      .then((r) => r.json())
      .then((data) => console.log("data returned:", data));
  }
};

const button = document.getElementById("get-users");
const inputForm = document.getElementById("input-form");
const input = document.getElementById("input");

button.addEventListener("click", getRumors);
inputForm.addEventListener("submit", (e) => {
  createRumor(input.value);
  e.preventDefault();
  inputForm.reset();
});
