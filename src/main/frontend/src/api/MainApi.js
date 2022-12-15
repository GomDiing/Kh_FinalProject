import axios from "axios";
const HEADER = 'application/json';
const TCAT_DOMAIN = "http://localhost:8100";


const MainApi={
  // 주간랭킹  
  rankingWeek : async function(category,size){
      // category = category,
      // size = size;
      return await axios.post(TCAT_DOMAIN + "/ranking/week", HEADER);
    },
}
export default MainApi;