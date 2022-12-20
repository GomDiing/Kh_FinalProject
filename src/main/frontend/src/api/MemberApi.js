import axios from "axios";
const HEADER = 'application/json';
const TCAT_DOMAIN = "http://localhost:8100";

const MemberApi = {
  // 홈페이지 회원가입
  signup : async function(inputId, inputPwd, inputName, inputEmail, road, jibun, address, postCode) {
    const signMember = {
      id : inputId,
      password : inputPwd,
      name : inputName,
      email : inputEmail,
      road : road,
      jibun : jibun,
      detail : address,
      zipcode : postCode,
      providerType : "HOME"
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
    return await axios.get(TCAT_DOMAIN+`/api/qna/mypage/1?page=${(currentPage - 1)}&size=${setPageSize}&sort=index,desc`, HEADER)
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
    return await axios.post(TCAT_DOMAIN + "/api/qna/write", params, HEADER);
  },
  // 5번 이상 신고당했을 시, 블랙리스트 회원으로 전환(프론트 미구현)
  changeBlack : async function(){
    return await axios.get(TCAT_DOMAIN+ "/api/mebmer/accuse/process", HEADER)
  },
  // 로그인
  login : async function(id, password, providerType) {
    const loginObj = {
      id : id,
      password : password,
      providerType : providerType
    }
    return await axios.post(TCAT_DOMAIN + "/api/member/signin", loginObj, HEADER);
  },
  // 복구
  deleteCancel : async function(id, password) {
    const cancelObj = {
      id : id,
      password : password
    }
    return await axios.post(TCAT_DOMAIN + "/api/member/delete/cancel", cancelObj, HEADER);
  }
}
export default MemberApi;