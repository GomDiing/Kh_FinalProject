import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import styled from "styled-components";
import { Rate } from "antd";
import ChildReview from "./ChildReview";
import { AlertOutlined } from "@ant-design/icons";
import DetailApi from "../../../../../../api/DetailApi";
import AccuseModal from "./AccuseModal";
import { useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import { Pagination } from "antd";
import { useNavigate} from "react-router-dom";


const ReviewBody=(props)=>{
  // 로그인 유저 정보를 리덕스에서 가져옴
  const userInfo = useSelector((state) => state.user.info)
  const memberIndex = userInfo.userIndex;
  const loginMember = userInfo.userId; // 삭제버튼 오픈용(로그인 회원 일치)

    //  리액트 페이지네이션 변수 
    const [reviewList2, setReviewList2] = useState([]);
    const [pageSize, setPageSize] = useState(4); // 한페이지에 몇개씩 있을건지
    const [totalCount, setTotalCount] = useState(0); // 총 데이터 숫자
    const [currentPage, setCurrentPage] = useState(1); // 현재 몇번째 페이지인지

  const navigate = useNavigate();

  // 댓글 데이터 받아서 페이지값 넘기기
  useEffect(() => {
    const reviewData = async() => {
      try {
        const res = await DetailApi.allReviewComment(props.code,currentPage, pageSize);
        if(res.data.statusCode === 200) {
          setReviewList2([...reviewList2, ...res.data.results.review_comment_list]);
          // 페이징 시작
          setTotalCount(res.data.results.totalResults); 
          // db에서 잘라준 size 별로 잘랐을때 나온 페이지 수
          setCurrentPage(res.data.results.page);
        } 
      } catch (e) {
        console.log(e);
      }
    };
    reviewData();
  }, [props.code,currentPage]);


    // 모달부분
    const [modalOpen, setModalOpen] = useState(false);
    // const open = () => setModalOpen(true);
    const open = (index) => setModalOpen(index);
    const close = () => setModalOpen(false);

    // 후기 글 삭제
    const onClickDelete=async(index)=>{
      try{
        const res = await DetailApi.deleteComment(index, memberIndex);
        if(res.data.statusCode === 200){
          alert(res.data.message)
          navigate(0);
        }
      } catch(e){
        if(e.response.data.statusCode === 400){
          alert(e.response.data.message);
        } else{
          console.log(e);
        }
      }
    };

    return(
        <ReviewBodyBlock>
        {reviewList2&&reviewList2.map(({index,memberIndex,memberId, title, content, rate, like,group,productCode,createTime,child_comment_list})=>(
          // 배열 key 값 index로 잡음(글 고유 index)
        <div key={index}>
          <Alert variant="secondary" className="first-comment-container">
            <div className="review-head-container">
              <div className="review-head-left">
              <Rate allowHalf disabled className="rate" value={rate} style={{ fontSize: '1.3rem'}}/>
              </div>
              <div className="review-head-right">
                  <Form.Label className="review-id">{memberId}</Form.Label>
                  <Form.Label className="review-id">{createTime}</Form.Label>
                  {/* 신고 */}
                  <AlertOutlined style={{alignItem: 'baseline', color: 'red', fontSize: '1.5rem'}}
                  onClick={()=>open(index)}/>
                  {modalOpen === index &&<AccuseModal
                  // props 넘겨줄것들
                  open={open} 
                  close={close}
                  index={index}
                  memberIndex={memberIndex}
                  title={title}
                   />}
                  {/* <Form.Label className="review-like">{like}</Form.Label> */}
              </div>
            </div>

            <div className="review-btn-container">
              {/* 로그인한 회원이랑 작성자랑2 동일하면 삭제 버튼 */}
              {memberId === loginMember && (
              <>
              <button className="review-delete-btn" 
                onClick={()=>onClickDelete(index)}>삭제</button>
              </>
              )}
          </div>
          <Alert.Heading className="review-title">{title}</Alert.Heading>
           <p className="review-content">{content}</p>
          <hr/>
          <ChildReview 
          child_comment_list={child_comment_list} 
          index={index} 
          code={productCode}/>
        </Alert>
        </div>
        ))}
        <Pagination className="reply-pagination"
             total={totalCount}  //총 데이터 갯수
             current={currentPage}
             pageSize={pageSize}
             onChange={(page) => {setCurrentPage(page); 
              setReviewList2([]);}} //숫자 누르면 해당 페이지로 이동
            />
        </ReviewBodyBlock>
    )
}
export default ReviewBody;

const ReviewBodyBlock = styled.div`
.first-comment-container{
  width: 50vw;
  margin: 0 20px ;
  margin-bottom: 35px;
  background-color: #f5f5f5;
  overflow: hidden;
}
.review-head-container{
  /* display: flexbox; */
  justify-content: space-between;

}
.review-head-right{
  float: right;
  .review-id,.review-like{
    margin-right: 20px;
  }
  /* justify-content: space-between; */
}
.review-title{
  width: 90%;
  margin-top: 15px;
}
.review-content{
  height: 50px;
}
hr{
  margin-top: 15px;
}
.review-btn-container{
  float: right;
}
.child-reply-container{
  width: 50vw;
  margin: 0 20px ;
}
.review-btn-container{
  margin-right: 10px;
}
.review-update-btn, .review-delete-btn{
  background-color: transparent;
  margin-left: 7px;
  border: none;
  color: red;

}
.reply-pagination{
  
}

`;