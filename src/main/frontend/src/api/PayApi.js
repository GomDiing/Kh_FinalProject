import axios from "axios";
import {TCATS_DOMAIN} from "../components/Config";
const HEADER = {'Content-Type' :  'application/json'}

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
    return await axios.post( "/api/reserve/payment", payReadyObj, HEADER);
  },
  // 결제 환불
  payCancel : async function(ticket, refundAmount) {
    return await axios.get(`/api/reserve/refund/${ticket}/${refundAmount}`, HEADER);
  },
  // 결제 내역 조회
  paySelect : async function(index) {
    return await axios.get(`/api/reserve/list/payment/${index}`, HEADER);
  },
  payCancelSelect : async function(index) {
    return await axios.get(`/api/reserve/list/refund-cancel/${index}`, HEADER);
  },
  // 결제 취소 내역


  // 카카오Pay 통신 - 준비(Ready)
  payKakaoReady : async function(itemName, quantity, totalAmount, taxFreeAmount) {
    const payKakaoReadyData = {
      itemName : itemName,
      quantity : quantity,
      totalAmount : totalAmount,
      taxFreeAmount : taxFreeAmount
    }
    return await axios.post('/pay/kakao/ready', payKakaoReadyData);
  },

  // 카카오Pay 통신 - 승인(Approve)
  payKakaoApprove : async function(pg_token, tid) {
    const payKakaoApproveData = {
      pg_token : pg_token,
      tid : tid
    }
    return await axios.post('/pay/kakao/approve', payKakaoApproveData)
  }
}

export default PayApi;