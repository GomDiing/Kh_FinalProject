import axios from "axios";
const HEADER = {'Content-Type' :  'application/json'}
const TCAT_DOMAIN = "http://localhost:8100";
// const TCAT_DOMAIN = "http://3.37.94.106:8102";


const MainApi={
    // 주간랭킹 
    rankingWeek : async function(category,size){
      return await axios.get(TCAT_DOMAIN + '/ranking/week?category=' + category +'&size=' + size,HEADER);
    },
    // 월간랭킹
    rankingMonth: async function(category,size){
      return await axios.get(TCAT_DOMAIN + '/ranking/month?category=' + category +'&size=' + size,HEADER);
    },
    // 종료임박
    rankingClose: async function(category,size){
      return await axios.get(TCAT_DOMAIN + '/ranking/close?category=' + category +'&size=' + size,HEADER);
    },
    // 검색결과
    mainsearch: async function(title){
      return await axios.get(TCAT_DOMAIN + '/api/product/search?title='+title,HEADER)
    }

}
export default MainApi;