import "./style.css";

//const env = process.env.NODE_ENV;
const env = "development";

const serverAddress =
  env === "development"
    ? "http://localhost:4000"
    : "https://flea-market-game.herokuapp.com/api";

const getRumors = async () => {
  const response = await fetch(`${serverAddress}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: "{ rumors {id, rumor_content, created_at} }",
    }),
  });
  const json = await response.json();
  return json;
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
    }).then((r) => {
      if (r.status === 200) {
        return;
      } else {
        console.log(r.status);
      }
    });
  }
};

const button = document.getElementById("get-rumors");
const inputForm = document.getElementById("input-form");
const input = document.getElementById("input");

const showRumors = (data) => {
  const container = document.createElement("div");
  container.id = "rumor-container";
  data.data.rumors.map((rumor) => {
    const rumorDiv = document.createElement("div");
    rumorDiv.innerHTML = rumor.rumor_content;
    container.appendChild(rumorDiv);
  });
  document.body.appendChild(container);
};

getRumors().then((r) => showRumors(r));

button.addEventListener(
  "click",
  console.log("z")
  //getRumors().then((r) => showRumors(r))
);
inputForm.addEventListener("submit", (e) => {
  createRumor(input.value);
  e.preventDefault();
  inputForm.reset();
});
