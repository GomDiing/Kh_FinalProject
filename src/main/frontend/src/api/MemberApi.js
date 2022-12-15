import axios from "axios";
const HEADER = 'application/json';
const TCAT_DOMAIN = "http://localhost:8100";

const MemberApi = {
  signup : async function(inputId, inputPwd, inputName, inputEmail, road, jibun, address, postCode) {
    const signMember = {
      id : inputId,
      password : inputPwd,
      name : inputName,
      email : inputEmail,
      road : road,
      jibun : jibun,
      detail : address,
      zipcode : postCode
    }
    return await axios.post(TCAT_DOMAIN + "/api/member/sign", signMember, HEADER);
  },

  findId : async function(name, email) {
    const findIdObj = {
      name : name,
      email : email
    }
    return await axios.post(TCAT_DOMAIN + "/api/member/find-id", findIdObj, HEADER);
  },

  findPassword : async function(id, name, email) {
    const findPwdObj = {
      id : id,
      name : name,
      email : email
    }
    return await axios.post(TCAT_DOMAIN + "/api/member/find-password", findPwdObj, HEADER);
  },

  searchEmail : async function(email) {
    const searchByEmail = {
      email : email
    }
    return await axios.post(TCAT_DOMAIN + "/api/member/search-by-email", searchByEmail, HEADER);
  },

  memberUpdate : async function(inputId, inputPwd, inputName, inputEmail, road, jibun, address, postCode) {
    const updateMember = {
      id : inputId,
      password : inputPwd,
      name : inputName,
      email : inputEmail,
      road : road,
      jibun : jibun,
      detail : address,
      zipcode : postCode
    }
    return await axios.post(TCAT_DOMAIN + "/api/mebmer/info-update", updateMember, HEADER);
  },

  myQnalist : async function(currentPage, setPageSize) {
    return await axios.get(TCAT_DOMAIN + `/notice/list?page=${(currentPage - 1)}&size=${setPageSize}`, HEADER)
  },
}
export default MemberApi;