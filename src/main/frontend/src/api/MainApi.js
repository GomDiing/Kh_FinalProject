import {api} from "./axios";
const HEADER = {'Content-Type' :  'application/json'}

const MainApi={
    // 주간랭킹 
    rankingWeek : async function(category, size){
      return await api.get('/ranking/week?category=' + category +'&size=' + size,HEADER);
    },
    // 월간랭킹
    rankingMonth: async function(category, size){
      return await api.get('/ranking/month?category=' + category +'&size=' + size, HEADER);
    },
    // 지역별
    rankingArea: async function(regionCode, size){
      return await api.get('/ranking/region?regionCode='+ regionCode +'&size=' + size, HEADER);
    },
    // 검색결과
    mainsearch: async function(title){
      return await api.get('/api/product/search?title='+title, HEADER)
    }

}
export default MainApi;