import { serverAddress } from "../serverAddress";
import { socket } from "../socketConnection";

const getRumorQuery = `query getRumors($date: String) {
    rumors(date: $date) {id, rumor_content, created_at}
  }`;

//if date is passed return rumors created after or equal to date
export const getRumors = async (date) => {
  const response = await fetch(`${serverAddress}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: getRumorQuery,
      variables: { date },
    }),
  });
  const json = await response.json();
  return json;
};

const query = `mutation CreateRumor($rumorContent: String) {
    createRumor(rumorContent: $rumorContent) {
      id
    }
  }`;

export const createRumor = (rumorContent) => {
  if (rumorContent.length > 0) {
    fetch(`${serverAddress}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          rumorContent,
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
