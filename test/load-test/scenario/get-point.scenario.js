const getPointScenario = {
  executor: "ramping-vus",
  startVUs: 0,
  stages: [
    { duration: "5s", target: 1000 },
    { duration: "1m", target: 1000 },
    { duration: "10s", target: 0 },
  ],
  exec: "getPoint", // 이 시나리오에서 실행할 함수 지정
};

export default getPointScenario;
