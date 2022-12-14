import axios from "axios";
const HEADER = 'application/json';

const MemberApi = {
  signup : async function(id, password, name, email, road, jibun, detail, zipcode) {
    const signMember = {
      id : id,
      password : password,
      name : name,
      email : email,
      road : road,
      jibun : jibun,
      detail : detail,
      zipcode : zipcode
    }
    return await axios.post("/member/sign", signMember, HEADER);
  },

  findId : async function(name, email) {
    const findIdObj = {
      name : name,
      email : email
    }
    return await axios.post("/member/find-id", findIdObj, HEADER);
  },

  findPassword : async function(id, name, email) {
    const findPwdObj = {
      id : id,
      name : name,
      email : email
    }
    return await axios.post("/member/find-password", findPwdObj, HEADER);
  },

  searchEmail : async function(email) {
    const searchByEmail = {
      email : email
    }
    return await axios.post("/member/search-by-email", searchByEmail, HEADER);
  },

  memberUpdate : async function(index, id, password, name, email, road, jibun, detail, zipcode) {
    const updateMember = {
      index : index,
      id : id,
      password : password,
      name : name,
      email : email,
      road : road,
      jibun : jibun,
      detail : detail,
      zipcode : zipcode
    }
    return await axios.post("/mebmer/info-update", updateMember, HEADER);
  }
}
export default MemberApi;