import axios from "axios";
const HEADER = {'Content-Type' :  'application/json'}
const TCAT_DOMAIN = "http://localhost:8100";
// const TCAT_DOMAIN = "http://3.37.94.106:8102";


const PayApi = {
  // 결제 요청
  payReady : async function(userIndex, seatIndex, value, amount, point, method, tid, total, kakaoTaxFreeAmount) {
    const payReadyObj = {
      memberIndex : userIndex,
      reserveTimeSeatPriceId : seatIndex,
      quantity : value,
      amount : amount,
      point : 0,
      method : method,
      kakaoTID : tid,
      finalAmount : total,
      kakaoTaxFreeAmount : kakaoTaxFreeAmount
    }
    return await axios.post(TCAT_DOMAIN + "/api/reserve/payment", payReadyObj, HEADER);
  },
  // 결제 환불
  payCancel : async function(ticket, refundAmount) {
    return await axios.get(TCAT_DOMAIN + `/api/reserve/refund/${ticket}/${refundAmount}`, HEADER);
  },
  // 결제 내역 조회
  paySelect : async function(index) {
    return await axios.get(TCAT_DOMAIN + `/api/reserve/list/payment/${index}`, HEADER);
  },
  payCancelSelect : async function(index) {
    return await axios.get(TCAT_DOMAIN + `/api/reserve/list/refund-cancel/${index}`, HEADER);
  }
  // 결제 취소 내역

}
export default PayApi;