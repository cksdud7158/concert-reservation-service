import http from "k6/http";
import { check, sleep } from "k6";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";
import waitingQueueScenario from "./scenario/waiting-queue.scenario.js";
import { Trend } from "k6/metrics";

let concertScheduleListDuration = new Trend("concert_schedule_list_duration");
export let options = {
  scenarios: {
    getToken: waitingQueueScenario,
  },
};

export function getToken() {
  let userId = randomIntBetween(1, 500);

  let payload = JSON.stringify({ userId });
  let params = {
    headers: { "Content-Type": "application/json" },
  };
  let response = http.post("http://localhost:3000/token", payload, params);

  check(response, {
    "is status 201": (r) => true,
  });

  sleep(1);

  if (response.body) {
    getConcertSchedules(response.body);
  }
}

function getConcertSchedules(token) {
  let concertId = randomIntBetween(1, 500);

  let params = {
    headers: { Authorization: `Bearer ${token}` },
  };
  let response = http.get(
    `http://localhost:3000/concerts/${concertId}/schedules`,
    params,
  );

  check(response, {
    "is status 200": (r) => r.status === 200,
    "has schedules": (r) => JSON.parse(r.body).total,
  });

  concertScheduleListDuration.add(response.timings.duration);

  sleep(1);
}
