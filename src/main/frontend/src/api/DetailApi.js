import axios from "axios";
const HEADER = 'application/json'; 
const TCAT_DOMAIN = "http://localhost:8100"; //server path

const DetailApi={
    //  관람 후기 작성(부모댓글=후기)
    sendComment : async function(memberIndex,inputTitle, inputContent, rate, productCode){
        console.log(memberIndex,inputTitle, inputContent, rate, productCode);
        debugger;
        const params = {
            memberIndex : memberIndex,
            title : inputTitle,
            content : inputContent,
            rate : rate,
            code : productCode
        }
        return await axios.post(TCAT_DOMAIN+"/api/review/write", params, HEADER);
    },
    // 대댓글 작성(자식댓글)
    childComment : async function(memberIndex,group,inputContent,productCode){
        console.log("댓글 코드 " + productCode);
        const params = {
            memberIndex : memberIndex,
            group : group, // 부모댓글 group값 = 부모 댓글 고유 index 값
            content : inputContent,
            code : productCode // 공연상품 code 값
        }
        return await axios.post(TCAT_DOMAIN+"/api/review/add", params, HEADER);
    },
    // 공연 후기 수정
    updateComment : async function(memberIndex,commentIndex,content){
        const params = {
            memberIndex : memberIndex,
            index : commentIndex, // 댓글 고유 index 값
            content : content
        }
        return await axios.post(TCAT_DOMAIN+"/api/review/update",params,HEADER)
    },

    // 후기 삭제 
    deleteComment : async function(commentIndex, memberIndex){
        console.log("api 찍힌 값 : " + commentIndex, memberIndex);
        const params = {
            index : commentIndex, // 후기(댓글) 고유 index 값 
            memberIndex : memberIndex
        }
        return await axios.post(TCAT_DOMAIN+"/api/review/delete", params,HEADER)
    },
     // 전체 댓글 불러오기(상세페이지 이동시)
    allReviewComment : async function(productCode){
        return await axios.get(TCAT_DOMAIN + `/api/review/all/${(productCode)}?sort=index,desc`, HEADER)
    },
    // 후기 신고하기
    accuseComment : async function(reviewIndex,victionEmail, suspectEmail,reason){
        const params = {
            memberEmailVictim : victionEmail, // 신고한사람
            memberEmailSuspect : suspectEmail, // 신고당한사람 (글작성자)
            reason : reason //신고사유
        }
        return await axios.post(TCAT_DOMAIN+`/api/accuse/${(reviewIndex)}`,params, HEADER)
    },

    // 상품 상세 가져오기
    getDetail : async function(pCode) {
    return await axios.get(TCAT_DOMAIN + `/api/product/${(pCode)}`, HEADER);
    },
    // 다음달 예매가능 일자 
    getNextReserve : async function(code, year, month) {
        // const params = {
        //     code: code,
        //     year: year,
        //     month: month
        // }
    return await axios.get(TCAT_DOMAIN + `/api/product/${(code)}/${(year)}/${(month)}`, HEADER);
    }
}
export default DetailApi;
