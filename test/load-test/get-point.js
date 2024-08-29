import http from "k6/http";
import { check, sleep } from "k6";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";
import getPointScenario from "./scenario/get-point.scenario.js";

export let options = {
  scenarios: {
    getPoint: getPointScenario,
  },
};

export function getPoint() {
  let userId = randomIntBetween(1, 10000);
  let response = http.get(`http://localhost:3000/user/${userId}/balance`);

  check(response, {
    "is status 200": (r) => r.status === 200,
  });

  sleep(1);
}
