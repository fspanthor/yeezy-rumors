import "./style.css";
const { io } = require("socket.io-client");

//const env = process.env.NODE_ENV;
const env = "development";

const serverAddress =
  env === "development"
    ? "http://localhost:4000"
    : "https://flea-market-game.herokuapp.com/api";

const socket = io(serverAddress, { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("socket id: ", socket.id);
});

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
        socket.emit("rumor-added");
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

const rumorBank = [];

const showRumors = async (data) => {
  const container = document.createElement("div");
  container.id = "rumor-container";
  data.data.rumors.map((rumor) => {
    //add to rumor bank to detect new rumors later
    rumorBank.push(rumor);
    const rumorDiv = document.createElement("div");
    rumorDiv.innerHTML = rumor.rumor_content;
    container.appendChild(rumorDiv);
  });
  document.body.appendChild(container);
};

const findNewRumor = (rumorBank, newRumors) => {
  const newRumor = newRumors.filter(
    ({ id: id1 }) => !rumorBank.some(({ id: id2 }) => id2 === id1)
  );
  return newRumor;
};

getRumors().then((r) => showRumors(r));

socket.on("new-rumor-detected", async () => {
  //get fresh batch of rumors to find new rumor
  const refreshedRumors = await getRumors();
  const newRumor = findNewRumor(rumorBank, refreshedRumors.data.rumors);
  //update rumor bank with new rumor
  rumorBank.push(newRumor[0]);

  const newRumorDiv = document.createElement("div");
  newRumorDiv.innerHTML = newRumor[0].rumor_content;
  document.getElementById("rumor-container").appendChild(newRumorDiv);
  console.log("new rumor detected");
});

button.addEventListener("click", () => getRumors());
inputForm.addEventListener("submit", (e) => {
  createRumor(input.value);
  e.preventDefault();
  inputForm.reset();
});
