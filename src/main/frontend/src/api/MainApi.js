import axios from "axios";
import {TCATS_DOMAIN} from "../components/Config";
const HEADER = {'Content-Type' :  'application/json'}

const MainApi={
    // 주간랭킹 
    rankingWeek : async function(category,size){
      return await axios.get(TCATS_DOMAIN + '/ranking/week?category=' + category +'&size=' + size,HEADER);
    },
    // 월간랭킹
    rankingMonth: async function(category,size){
      return await axios.get(TCATS_DOMAIN + '/ranking/month?category=' + category +'&size=' + size,HEADER);
    },
    // 지역별
    rankingArea: async function(regionCode,size){
      return await axios.get(TCATS_DOMAIN + '/ranking/region?regionCode='+ regionCode +'&size=' + size,HEADER);
    },
    // 검색결과
    mainsearch: async function(title){
      return await axios.get(TCATS_DOMAIN + '/api/product/search?title='+title,HEADER)
    }

}
export default MainApi;