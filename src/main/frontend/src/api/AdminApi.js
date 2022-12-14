import axios from "axios";
import { createSearchParams } from "react-router-dom";
const HEADER = 'application/json';
<<<<<<< HEAD
const contentType = 'application/json';
//const TCAT_DOMAIN= "http://localhost:7700";//server path
//const serverPAthTCAT_DOMAIN= "http://localhost:7700";//server path
// "http://cokebear756.synology.me:33060";
=======
const TCAT_DOMAIN= "http://localhost:7777";//server path

>>>>>>> f1e25967bc94716bca8ad7f93e2eb76874c53cae

const AdminApi={
    //공지사항 쓰기 api
    writing : async function(inputTitle, inputDetail){
        const params = {
            title : inputTitle,
            content : inputDetail
        }
        return await axios.post("/notice/write", params, HEADER);
    },
    // 공지사항 전체 목록
    noticeInfo : async function(currentPage ,setPageSize){
        return await axios.get(`/notice/list?page=${(currentPage - 1)}&size=${setPageSize}`, HEADER)
    },
    // 공지사항 상세페이지
    noticeDetail : async function(index){
        return await axios.get("/notice/detail/" + index, "Text/json")
    },

    // 공지사항 삭제 
    noticeDelete : async function(index){
<<<<<<< HEAD
        return await axios.delete("/notice/delete/"+ index, HEADER)
=======
        return await axios.delete( TCAT_DOMAIN + "/notice/delete/"+ index, HEADER)
>>>>>>> f1e25967bc94716bca8ad7f93e2eb76874c53cae
    },

    // (체크박스) 공지사항 삭제
    noticeCheck : async function(arrItems){
        const arrKeys = [];
        for(var i=0; i<arrItems.length; i++){
            arrKeys.push({"index":arrItems[i]});
        }
        const params = {
            checkDTOList: arrKeys
        };
        // debugger;
<<<<<<< HEAD
        return await axios.post("/notice/delete/check",params, "application/json");
=======
        return await axios.post(TCAT_DOMAIN +"/notice/delete/check",params, "application/json");
>>>>>>> f1e25967bc94716bca8ad7f93e2eb76874c53cae
    },

    // 공지사항 수정
    noticeEdit : async function(inputTitle, inputDetail, index){
        const editing = {
            title : inputTitle,
            content : inputDetail
        }
        return await axios.put("/notice/edit/" +index, editing, HEADER)
    },

    // 회원 전체 조회
<<<<<<< HEAD
    totalMember : async function(){
        return await axios.get("/memberlist", HEADER)
    },
    // 블랙리스트 회원 조회
    totalBlackMember : async function(){
        return await axios.get("/blacklist", HEADER)
=======
    totalMember : async function(currentPage ,setPageSize){
        return await axios.get(TCAT_DOMAIN+`/api/member/memberlist?page=${(currentPage - 1)}&size=${setPageSize}`, HEADER)
    },
    // 블랙리스트 회원 조회
    totalBlackMember : async function(currentPage ,setPageSize){
        return await axios.get(TCAT_DOMAIN+`/api/member/memberblacklist?page=${(currentPage - 1)}&size=${setPageSize}`, HEADER)
>>>>>>> f1e25967bc94716bca8ad7f93e2eb76874c53cae
    },

    // 회원 탈퇴(관리자)
    deleteMemberAdmin : async function(arrItems){
    const arrKeys = [];
    for(var i=0; i<arrItems.length; i++){
        arrKeys.push({"index":arrItems[i]});
    }
    const params = {
        memberDTOCheckList: arrKeys
    };
<<<<<<< HEAD
    return await axios.post("/notice/delete/member/check",params, "application/json");
=======
    return await axios.post( "/notice/delete/member/check",params, "application/json");
>>>>>>> f1e25967bc94716bca8ad7f93e2eb76874c53cae
},
    // 일대일문의(qna) 전체 조회
    qnaList : async function(){
        return await axios.get("/qna/list", HEADER)
    },
    // qna 관리자 답장
    qnaReply : async function(inputReply,index) {
        console.log("api통신 되는지 " + inputReply +index);
        const params = {
            reply : inputReply,
            index : index
        }
        return await axios.post("/qna/reply", params, HEADER);
    },
    // 차트 정보
    getChart : async function() {
        return await axios.get("/admin/chart", HEADER)
    },
    /* 배너 등록하기(관리자) 아직 미구현   */ 
    uploadBanner : async function(){
        return await axios.post("/admin/banner", HEADER)
    }
}
export default AdminApi;