import axios from "axios";
const HEADER = {'Content-Type' : 'application/json'}

const WishLikeApi = {
    addWish : async function(memberIndex, pCode) {
        const add = {
        member_index : memberIndex,
        product_code : pCode
        }
        return await axios.post("/api/wish/add", add, HEADER);
    },
    cancelWish : async function(memberIndex, pCode) {
        const cancel = {
        member_index : memberIndex,
        product_code : pCode
        }
        return await axios.post("/api/wish/cancel", cancel, HEADER);
    },
    wishList : async function(userIndex) {
        return await axios.get(`/api/wish/${(userIndex)}`, HEADER);
    },
    }
export default WishLikeApi;