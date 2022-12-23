import axios from "axios";
const HEADER = {'Content-Type' : 'application/json'}
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
// 아이디찾기
  findId : async function(name, email) {
    const findIdObj = {
      name : name,
      email : email
    }
    return await axios.post(TCAT_DOMAIN + "/api/member/find-id", findIdObj, HEADER);
  },
// 비밀번호찾기
  findPassword : async function(id, name, email) {
    const findPwdObj = {
      id : id,
      name : name,
      email : email,
      providerType : 'HOME'
    }
    return await axios.post(TCAT_DOMAIN + "/api/member/find-password", findPwdObj, HEADER);
  },
  // Id 로 정보 받아오기
  searchId : async function(id, providerType) {
    const searchById = {
      id : id,
      providerType : providerType
    }
    return await axios.post(TCAT_DOMAIN + "/api/member/search-by-id", searchById, HEADER);
  },
  searchId2 : async function(email, providerType) {
    const searchById = {
      email : email,
      providerType : providerType
    }
    return await axios.post(TCAT_DOMAIN + "/api/member/search-by-id", searchById, HEADER);
  },
  // 회원 정보 수정
  memberUpdate : async function(inputId, inputPwd, inputName, inputEmail, road, jibun, address, postCode, type) {
    const updateMember = {
      id : inputId,
      password : inputPwd,
      name : inputName,
      email : inputEmail,
      road : road,
      jibun : jibun,
      detail : address,
      zipcode : postCode,
      providerType : type
    }
    return await axios.post(TCAT_DOMAIN + "/api/member/info-update", updateMember, HEADER);
  },
  // 마이페이지 qna 목록
  myQnalist : async function(userIndex, currentPage, setPageSize){
    return await axios.get(TCAT_DOMAIN+`/api/qna/mypage/${(userIndex)}?page=${(currentPage - 1)}&size=${setPageSize}&sort=index,desc`, HEADER)
  },
  // qna 전송하기
  sendQna : async function(memberIndex,inputSelect,inputQnaTitle,inputQnaContent) {
    console.log("문의 값: " +memberIndex, inputSelect,inputQnaTitle, inputQnaContent );
    // debugger;
    const params = {
      index : memberIndex,
      category : inputSelect,
      title : inputQnaTitle,
      content : inputQnaContent
    }
    return await axios.post(TCAT_DOMAIN + "/api/qna/write", params, HEADER);
  },
  // 5번 이상 신고당했을 시, 블랙리스트 회원으로 전환
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
  },
  // 소셜 회원가입
  socialSign : async function(inputName, inputEmail, road, jibun, address, postCode, type){
    const signMember = {
      name : inputName,
      email : inputEmail,
      road : road,
      jibun : jibun,
      detail : address,
      zipcode : postCode,
      providerType : type,
    }
    return await axios.post(TCAT_DOMAIN + "/api/member/sign", signMember, HEADER);
  },
  // 회원탈퇴
  deleteMmeber : async function(id, password, providerType) {
    const delteMemberObj = {
      id : id,
      password : password,
      providerType : providerType
    }
    return await axios.post(TCAT_DOMAIN + '/api/member/delete', delteMemberObj, HEADER);
  }
}
export default MemberApi;