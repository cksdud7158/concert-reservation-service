import http from "k6/http";
import { check, sleep } from "k6";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";
import chargePointScenario from "./scenario/charge-point.scenario.js";

export let options = {
  scenarios: { chargePoint: chargePointScenario },
};

export function chargePoint() {
  let userId = randomIntBetween(1, 10000);
  let chargePoint = randomIntBetween(1000, 10000);
  let payload = JSON.stringify({ amount: chargePoint });
  let params = {
    headers: { "Content-Type": "application/json" },
  };

  let response = http.patch(
    `http://localhost:3000/user/${userId}/charge`,
    payload,
    params,
  );

  check(response, {
    "is status 200": (r) => r.status === 200,
  });

  sleep(1);
}
