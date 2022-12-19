import axios from "axios";
const HEADER = 'application/json'; 
const TCAT_DOMAIN = "http://localhost:8100"; //server path

const DetailApi={
    //  관람 후기 작성
    sendComment : async function(memberId, content, rate, code){
        const params = {
            memberId : memberId,
            content : content,
            rate : rate,
            code : code
        }
        return await axios.post(TCAT_DOMAIN+"/api/review/write", params, HEADER);
    },
    // 상품 상세 가져오기
    getDetail : async function(pCode) {
    const param = {
        code: pCode
    }
    return await axios.get(TCAT_DOMAIN + `/api/product/${(pCode)}`, param, HEADER);
    }
}
export default DetailApi;