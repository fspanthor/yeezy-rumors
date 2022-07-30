import "./style.scss";

const createDOMPurify = require("dompurify");
const DOMPurify = createDOMPurify(window);
import { getRumors, createRumor } from "./service/httpRequests";
import {
  subtractDays,
  findNewRumor,
  rumorBank,
  rumorLimit,
  setRumorLimit,
  showRumors,
  showAbout,
  showHome,
  titleAnimation,
  tickerSpeed,
} from "./utilities";
import { socket } from "./socketConnection";
import {
  selectDate,
  newRumorPopupContainer,
  input,
  inputForm,
  aboutButton,
  homeButton,
  home,
  about,
} from "./htmlElements";

/**
 * event listeners
 */
selectDate.addEventListener("change", (e) => {
  if (e.target.value === "last-7-days") {
    setRumorLimit(subtractDays(new Date(), 0).toISOString().slice(0, 10), 7);
    rumorBank.length = 0;
    document.getElementById("rumor-container").remove();
    getRumors(rumorLimit).then((r) => showRumors(r));
  } else {
    setRumorLimit("");
    rumorBank.length = 0;
    document.getElementById("rumor-container").remove();
    getRumors(rumorLimit).then((r) => showRumors(r));
  }
});

inputForm.addEventListener("submit", (e) => {
  const sanitizedInput = DOMPurify.sanitize(input.value);
  createRumor(sanitizedInput);
  e.preventDefault();
  inputForm.reset();
});

aboutButton.addEventListener("click", () => {
  showAbout(home, about);
});

homeButton.addEventListener("click", () => {
  showHome(home, about);
});

socket.on("new-rumor-detected", async () => {
  //check if we need to remove no rumors placeholder
  const placeholder = document.getElementById("no-rumors-item");
  if (placeholder) {
    placeholder.remove();
  }

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
  hotNewRumorSpan.style.fontWeight = "bold";
  hotNewRumorSpan.innerHTML = "NEW RUMOR JUST DROPPED 🔥 ";

  const newRumorWrapper = document.createElement("div");
  newRumorWrapper.classList.add("new-rumor");
  newRumorWrapper.appendChild(hotNewRumorSpan);
  newRumorWrapper.appendChild(newRumorSpanForPopup);

  //add new rumor to ticker
  document.getElementById("rumor-container").appendChild(newRumorDivForTicker);

  //add new rumor to new rumor popup container
  newRumorPopupContainer.prepend(newRumorWrapper);

  //adjust ticker speed based on new rumor container size
  const rumorContainer = document.getElementById("rumor-container");
  rumorContainer.style["animation-duration"] = tickerSpeed(rumorContainer);
  rumorContainer.style["-webkit-animation-duration"] =
    tickerSpeed(rumorContainer);

  //animate title
  titleAnimation();

  //remove new rumor after some time
  setTimeout(() => {
    newRumorWrapper.remove();
  }, 7000);
});

getRumors().then((r) => showRumors(r));
