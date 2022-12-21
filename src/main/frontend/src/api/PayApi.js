import axios from "axios";
const HEADER = 'application/json';
const TCAT_DOMAIN = "http://localhost:8100";

const PayApi = {
  // 결제 요청
  payReady : async function(userIndex, seatIndex, value, amount, point, method, tid, total) {
    const payReadyObj = {
      memberIndex : userIndex,
      reserveTimeSeatPriceId : seatIndex,
      quantity : value,
      amount : amount,
      point : point,
      method : method,
      kakaoTID : tid,
      finalAmount : total
    }
    return await axios.post(TCAT_DOMAIN + "/api/reserve/payment", payReadyObj, HEADER);
  },
}
export default PayApi;