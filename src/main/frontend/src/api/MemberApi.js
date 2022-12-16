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

  searchId : async function(id) {
    const searchById = {
      id : id
    }
    return await axios.post(TCAT_DOMAIN + "/api/member/search-by-id", searchById, HEADER);
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
  // 마이페이지 qna 목록
  myQnalist : async function(currentPage, setPageSize){
    return await axios.get(TCAT_DOMAIN+`/qna/mypage/15?page=${(currentPage - 1)}&size=${setPageSize}`, HEADER)
  },
  // qna 전송하기
  sendQna : async function(memberId,inputSelect,inputQnaTitle,inputQnaContent) {
    console.log("문의 값: " +memberId, inputSelect,inputSelect, inputQnaContent );
    const params = {
      memberId : memberId,
      category : inputSelect,
      title : inputQnaTitle,
      content : inputQnaContent
    }
    return await axios.post(TCAT_DOMAIN + "/qna/write", params, HEADER);
  },
}
export default MemberApi;