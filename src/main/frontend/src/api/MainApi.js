import axios from "axios";
const HEADER = 'application/json';
const TCAT_DOMAIN = "http://localhost:8100";


const MainApi={
  // 주간랭킹  
  rankingWeek : async function(category,size){
      category = category
      
      return await axios.post(TCAT_DOMAIN + `/ranking/week?size=${(size)}`, HEADER);
    },
}
export default MainApi;