import http from "k6/http";
import { check, sleep } from "k6";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";
import waitingQueueScenario from "./scenario/waiting-queue.scenario.js";
import { Trend } from "k6/metrics";

let paymentDuration = new Trend("payment_duration");
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

  if (!response.body) return;

  check(response, {
    "is status 201": (r) => true,
  });

  sleep(1);

  if (response.body) {
    getConcertSchedules(response.body, userId);
  }
}

function getConcertSchedules(token, userId) {
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

  sleep(10);

  const res = JSON.parse(response.body);
  if (!res.total) return;
  getConcertSeats(
    token,
    userId,
    concertId,
    res.schedules[res.schedules.length - 1].id,
  );
}

function getConcertSeats(token, userId, concertId, scheduleId) {
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

  sleep(5);

  const res = JSON.parse(response.body);
  if (!res?.total) return;
  reserve(token, userId, concertId, scheduleId, res.seats[0].id);
}

function reserve(token, userId, concertId, scheduleId, seatId) {
  let payload = JSON.stringify({
    userId: userId,
    concertId: concertId,
    concertScheduleId: scheduleId,
    seatIds: [seatId],
  });

  let params = {
    headers: { Authorization: `Bearer ${token}` },
  };
  let response = http.post(
    "http://localhost:3000/reservation",
    params,
    payload,
  );

  check(response, {
    "is status 200": (r) => r.status === 200,
  });

  const res = JSON.parse(response.body);
  if (!res?.total) return;

  sleep(10);
  pay(
    token,
    userId,
    res.tickets.map((val) => val.id),
  );
}

function pay(token, userId, ticketIds) {
  let payload = JSON.stringify({
    userId: userId,
    ticketIds: ticketIds,
  });

  let params = {
    headers: { Authorization: `Bearer ${token}` },
  };
  let response = http.post("http://localhost:3000/payment", params, payload);

  check(response, {
    "is status 200": (r) => r.status === 200,
  });

  paymentDuration.add(response.timings.duration);
}
