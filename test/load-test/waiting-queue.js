import http from "k6/http";
import { check, sleep } from "k6";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";
import waitingQueueScenario from "./scenario/waiting-queue.scenario.js";
export let options = {
  scenarios: {
    tokenPost: waitingQueueScenario,
  },
};

export function getToken() {
  let userId = randomIntBetween(1, 10000);

  let payload = JSON.stringify({ userId });
  let params = {
    headers: { "Content-Type": "application/json" },
  };
  let response = http.post("http://localhost:3000/token", payload, params);

  check(response, {
    "is status 201": (r) => true,
  });

  sleep(1);
}
