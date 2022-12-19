import axios from "axios";
const HEADER = 'application/json';
const TCAT_DOMAIN = "http://localhost:8100";


const MainApi={
  // 주간랭킹 
  rankingWeek : async function(category,size){
      return await axios.get(TCAT_DOMAIN + '/ranking/week?category=' + category +'&size=' + size,HEADER);
    },
  rankingMonth: async function(category,size){
    return await axios.get(TCAT_DOMAIN + '/ranking/month?category=' + category +'&size=' + size,HEADER);
  },
  rankingClose: async function(category,size){
    return await axios.get(TCAT_DOMAIN + '/ranking/close?category=' + category +'&size=' + size,HEADER);
  },
}
export default MainApi;