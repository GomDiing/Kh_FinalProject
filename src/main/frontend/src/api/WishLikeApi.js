import axios from "axios";
const HEADER = {'Content-Type' : 'application/json'}
const TCAT_DOMAIN = "http://localhost:8100";

const WishLikeApi = {
    addWish : async function(memberIndex, pCode) {
        const add = {
        member_index : memberIndex,
        product_code : pCode
        }
        return await axios.post(TCAT_DOMAIN + "/api/wish/add", add, HEADER);
    },
    cancelWish : async function(memberIndex, pCode) {
        const cancel = {
        member_index : memberIndex,
        product_code : pCode
        }
        return await axios.post(TCAT_DOMAIN + "/api/wish/cancel", cancel, HEADER);
    },
    }
export default WishLikeApi;