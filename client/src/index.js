import "./style.scss";
const { io } = require("socket.io-client");
const createDOMPurify = require("dompurify");
const DOMPurify = createDOMPurify(window);

const env = process.env.NODE_ENV;

const serverAddress =
  env === "development"
    ? "http://localhost:4000"
    : "http://yeezy-rumors.herokuapp.com/";

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

const inputForm = document.getElementById("input-form");
const input = document.getElementById("input");
const newRumorPopupContainer = document.getElementById(
  "new-rumor-popup-container"
);

const rumorBank = [];

const showRumors = async (data) => {
  const container = document.createElement("div");
  container.classList.add("ticker");
  container.id = "rumor-container";
  data.data.rumors.map((rumor) => {
    //add to rumor bank to detect new rumors later
    rumorBank.push(rumor);
    const rumorDiv = document.createElement("div");
    rumorDiv.classList.add("ticker__item");
    rumorDiv.innerHTML = rumor.rumor_content;
    container.appendChild(rumorDiv);
  });
  document.getElementById("ticker-wrap").appendChild(container);
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

  const newRumorDivForTicker = document.createElement("div");
  newRumorDivForTicker.classList.add("ticker__item");
  newRumorDivForTicker.innerHTML = newRumor[0].rumor_content;

  const newRumorSpanForPopup = document.createElement("span");
  newRumorSpanForPopup.classList.add("new-rumor");
  newRumorSpanForPopup.innerHTML = newRumor[0].rumor_content;

  const hotNewRumorSpan = document.createElement("span");
  hotNewRumorSpan.classList.add("new-rumor");
  hotNewRumorSpan.innerHTML = "NEW RUMOR JUST DROPPED: ";

  const newRumorWrapper = document.createElement("div");
  newRumorWrapper.classList.add("new-rumor");
  newRumorWrapper.appendChild(hotNewRumorSpan);
  newRumorWrapper.appendChild(newRumorSpanForPopup);

  //add new rumor to ticker
  document.getElementById("rumor-container").appendChild(newRumorDivForTicker);

  //add new rumor to new rumor popup container
  newRumorPopupContainer.prepend(newRumorWrapper);

  //remove new rumor after some time
  setTimeout(() => {
    newRumorWrapper.remove();
  }, 7000);
});

inputForm.addEventListener("submit", (e) => {
  const sanitizedInput = DOMPurify.sanitize(input.value);
  createRumor(sanitizedInput);
  e.preventDefault();
  inputForm.reset();
});
