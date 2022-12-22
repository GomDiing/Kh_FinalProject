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
  // 결제 취소
  payCancel : async function(ticket, amount, discount, finalAmount, method, TID) {
    const payCancelObj = {
      amount : amount,
      discount : discount,
      finalAmount : finalAmount,
      method : method,
      kakaoTID : TID
    }
    return await axios.get(TCAT_DOMAIN + `/api/reserve/refund/${ticket}`, payCancelObj, HEADER);
  },
  // 결제 내역 조회
  paySelect : async function(index) {
    return await axios.get(TCAT_DOMAIN + `/api/reserve/list/payment/${index}`, HEADER);
  }
}
export default PayApi;