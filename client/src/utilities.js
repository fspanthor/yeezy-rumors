import { tickerWrap } from "./htmlElements";

export const subtractDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

//compare rumor bank with new rumors to detect new rumor
export const findNewRumor = (rumorBank, newRumors) => {
  const newRumor = newRumors.filter(
    ({ id: id1 }) => !rumorBank.some(({ id: id2 }) => id2 === id1)
  );
  return newRumor;
};

//rumors are stored in rumor bank
export const rumorBank = [];
//rumor limit is used to get rumors after a specified date
export let rumorLimit = "";

export const showRumors = async (data) => {
  const container = document.createElement("div");
  container.classList.add("ticker");
  container.id = "rumor-container";
  if (data.data.rumors.length === 0) {
    const rumorDiv = document.createElement("div");
    rumorDiv.classList.add("ticker__item");
    rumorDiv.setAttribute("id", "no-rumors-item");
    rumorDiv.innerHTML = "NO RUMORS FROM THIS DATE RANGE...";
    container.appendChild(rumorDiv);
  } else {
    data.data.rumors.map((rumor) => {
      //add to rumor bank to detect new rumors later
      rumorBank.push(rumor);
      const rumorDiv = document.createElement("div");
      rumorDiv.classList.add("ticker__item");
      rumorDiv.innerHTML = rumor.rumor_content;
      container.appendChild(rumorDiv);
    });
  }
  tickerWrap.appendChild(container);
};

export const setRumorLimit = (limit) => {
  rumorLimit = limit;
};

export const showAbout = (homeElement, aboutElement) => {
  homeElement.setAttribute("hidden", true);
  aboutElement.removeAttribute("hidden");
};

export const showHome = (homeElement, aboutElement) => {
  aboutElement.setAttribute("hidden", true);
  homeElement.removeAttribute("hidden");
};

export const titleAnimation = () => {
  const defaultTitle = "yeezy-rumors";
  const altTitle = "NEW RUMOR JUST DROPPED";
  for (let i = 0; i < 4; i++) {
    setTimeout(() => {
      if (document.title === defaultTitle) {
        document.title = altTitle;
      } else {
        document.title = defaultTitle;
      }
    }, i * 1000);
  }
};
