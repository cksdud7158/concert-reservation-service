import http from "k6/http";
import { check, sleep } from "k6";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";
import waitingQueueScenario from "./scenario/waiting-queue.scenario.js";
import { Trend } from "k6/metrics";

let concertSeatListDuration = new Trend("concert_seat_list_duration");

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
    getConcertSeats(response.body);
  }
}

function getConcertSeats(token) {
  let concertId = randomIntBetween(1, 500);
  let scheduleId = randomIntBetween(1, 500);

  let params = {
    headers: { Authorization: `Bearer ${token}` },
  };
  let response = http.get(
    `http://localhost:3000/concerts/${concertId}/schedules/${scheduleId}/seats`,
    params,
  );

  check(response, {
    "is status 200": (r) => r.status === 200,
    "has seat": (r) => JSON.parse(r.body).total,
  });

  concertSeatListDuration.add(response.timings.duration);

  sleep(1);
}
