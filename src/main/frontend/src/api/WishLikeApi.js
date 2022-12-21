import axios from "axios";
const HEADER = 'application/json';
const TCAT_DOMAIN = "http://localhost:8100";

const WishLikeApi = {
    deleteCancel : async function(id, password) {
        const cancelObj = {
        id : id,
        password : password
        }
        return await axios.post(TCAT_DOMAIN + "/api/member/delete/cancel", cancelObj, HEADER);
    }
    }
export default WishLikeApi;