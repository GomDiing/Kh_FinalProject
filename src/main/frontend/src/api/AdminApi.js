import axios, {AxiosHeaders} from "axios";

const HEADER = {
    'Content-Type' :  'application/json'
}


const AdminApi={
    //공지사항 쓰기 api
    writing : async function(inputTitle, inputDetail){
        const params = {
            title : inputTitle,
            content : inputDetail
        }
        return await axios.post( "/api/notice/write", params, HEADER);
    },
    // 공지사항 전체 목록
    noticeInfo : async function(currentPage, setPageSize){
        return await axios.get( `/api/notice/list?page=${(currentPage - 1)}&size=${setPageSize}&sort=index,desc`, HEADER)
    },
    // 공지사항 상세페이지
    noticeDetail : async function(index){
        return await axios.get("/api/notice/detail/" + index, "Text/json")
    },
    // 공지사항 삭제
    noticeDelete : async function(index){
        return await axios.delete( "/api/notice/delete/"+ index, HEADER)
    },

    // (체크박스) 공지사항 삭제
    noticeCheck :async function(arrItems){
        const arrKeys = [];
        for(var i=0; i<arrItems.length; i++){
            arrKeys.push({"index":arrItems[i]});
        }
        console.log("삭제할 공지 갯수 : " + arrKeys);
        // debugger;
        const params = {
            checkDTOList: arrKeys
        };
        return await axios.post( "/api/notice/delete/checkbox", params, HEADER);
    },
    // 공지사항 수정
    noticeEdit : async function(inputTitle, inputDetail, index){
        const editing = {
            title : inputTitle,
            content : inputDetail
        }
        return await axios.put( "/api/notice/edit/"+index, editing, HEADER)
    },

    // 회원 전체 조회
    totalMember : async function(currentPage, setPageSize){
        return await axios.get(`/api/member/memberlist?page=${(currentPage - 1)}&size=${setPageSize}&sort=index,desc`, HEADER)
    },
    // 블랙리스트 회원 조회
    totalBlackMember : async function(currentPage, setPageSize){
        return await axios.get(`/api/member/blacklist?page=${(currentPage - 1)}&size=${setPageSize}&sort=index,desc`, HEADER)
    },

    // 체크박스로 회원 탈퇴(관리자)
    deleteMemberAdmin : async function(arrItems){
    const arrKeys = [];
    for (var i=0; i<arrItems.length; i++){
        arrKeys.push({"index":arrItems[i]});
    }
    const params = {
        memberDTOCheckList: arrKeys
    };
    return await axios.post( "/api/member/delete/checkbox", params, HEADER);
},
    // 일대일문의(qna) 전체 조회
    qnaList : async function(currentPage ,setPageSize){
        return await axios.get( `/api/qna/list?page=${(currentPage - 1)}&size=${setPageSize}&sort=index,desc`, HEADER)
    },
    // qna 관리자 답장
    qnaReply : async function(inputReply, index) {
        console.log(inputReply);
        const params = {
            reply : inputReply,
            index : index
        }
        return await axios.post( "/api/qna/reply", params, HEADER);
    },
    // 차트 정보
    getChart : async function() {
        return await axios.get( "/admin/chart/3", HEADER)
    },

    /* 배너 등록하기(관리자) 아직 미구현   */
    uploadBanner : async function(){
        return await axios.post( "/admin/banner", HEADER)
    },

    // 최신 공연 후기 글 4개 조회(메인페이지 화면 같이 씀)
    recentReview : async function(){
        return await axios.get( `/api/review/dashboard?sort=index,desc`, HEADER)
    },
    // 전시 전체 글 조회(관리자페이지용, 페이징)
    exhibitionList : async function(currentPage ,setPageSize){
        return await axios.get( `/api/product/list?page=${(currentPage - 1)}&size=${setPageSize}&sort=periodStart,desc`, HEADER)
    },
}
export default AdminApi;