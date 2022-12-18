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
    
  }
  export default DetailApi;