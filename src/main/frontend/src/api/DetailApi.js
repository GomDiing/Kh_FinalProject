import axios from "axios";
const HEADER = 'application/json'; 
const TCAT_DOMAIN = "http://localhost:8100"; //server path

const DetailApi={
    //  관람 후기 작성(부모댓글=후기)
    sendComment : async function(memberIndex,title, content, rate, code){
        const params = {
            memberIndex : memberIndex,
            title : title,
            content : content,
            rate : rate,
            code : code
        }
        return await axios.post(TCAT_DOMAIN+"/api/review/write", params, HEADER);
    },
    // 대댓글
    childComment : async function(memberIndex,group,content, code){
        const params = {
            memberIndex : memberIndex,
            group : group, // 부모댓글 group값 = 부모 댓글 고유 index 값
            content : content,
            code : code // 공연상품 code 값
        }
        return await axios.post(TCAT_DOMAIN+"/api/review/add", params, HEADER);
    },
     // 공연 후기 수정
     deleteComment : async function(memberIndex,commentIndex,content){
        const params = {
            memberIndex : memberIndex,
            index : commentIndex, // 댓글 고유 index 값
            content : content
        }
        return await axios.post(TCAT_DOMAIN+"/api/review/update",params,HEADER)
    },

    // 후기 삭제 
    deleteComment : async function(index, memberIndex){
        const params = {
            index : index, // 후기(댓글) 고유 index 값 
            memberIndex : memberIndex
        }
        return await axios.post(TCAT_DOMAIN+"/api/review/delete", params,HEADER)
    },
     // 전체 댓글 불러오기(상세페이지 이동시)
    allReviewComment : async function(productCode){
        
        return await axios.post(TCAT_DOMAIN+"/api/review/" + productCode, HEADER)
    },
    // 후기 신고하기
    accuseComment : async function(reviewIndex){
        // const params = {
        //     index : index,
        //     memberIndex : memberIndex
        // }
        return await axios.post(TCAT_DOMAIN+`/api/accuse/${(reviewIndex)}`, HEADER)
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
