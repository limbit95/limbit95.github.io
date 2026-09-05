export const CLASSIC_RULES = Object.freeze({
  initialMoney: 1500,
  startSalary: 200,
  events: Object.freeze([
    Object.freeze({ id: "travel-grant", type: "BONUS", amount: 120, label: "여행 지원금을 받았습니다." }),
    Object.freeze({ id: "lost-baggage", type: "TAX", amount: 90, label: "수하물 문제로 비용이 발생했습니다." }),
    Object.freeze({ id: "local-festival", type: "BONUS", amount: 160, label: "지역 축제 보너스를 받았습니다." }),
    Object.freeze({ id: "exchange-fee", type: "TAX", amount: 110, label: "환전 수수료가 발생했습니다." }),
  ]),
});
