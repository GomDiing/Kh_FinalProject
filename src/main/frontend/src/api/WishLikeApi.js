import axios from "axios";
import {TCATS_DOMAIN} from "../components/Config";
const HEADER = {'Content-Type' : 'application/json'}

const WishLikeApi = {
    addWish : async function(memberIndex, pCode) {
        const add = {
        member_index : memberIndex,
        product_code : pCode
        }
        return await axios.post(TCATS_DOMAIN + "/api/wish/add", add, HEADER);
    },
    cancelWish : async function(memberIndex, pCode) {
        const cancel = {
        member_index : memberIndex,
        product_code : pCode
        }
        return await axios.post(TCATS_DOMAIN + "/api/wish/cancel", cancel, HEADER);
    },
    wishList : async function(userIndex) {
        return await axios.get(TCATS_DOMAIN + `/api/wish/${(userIndex)}`, HEADER);
    },
    }
export default WishLikeApi;