import axios from "axios";
const HEADER = 'application/json';



const MainApi={
  // 주간랭킹  
  rankingWeek : async function(category,size){
      // category = category,
      // size = size;
      return await axios.post("/ranking/week", HEADER);
    },
   
}
export default MainApi;