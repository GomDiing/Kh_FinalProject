import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styled from "styled-components";
import { Rate } from "antd";
import ChildReview from "./ChildReview";
import { AlertOutlined } from "@ant-design/icons";
import DetailApi from "../../../../../../api/DetailApi";
import AccuseModal from "./AccuseModal";
import { useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';


const ReviewBody=(props)=>{
  // 로그인 유저 정보를 리덕스에서 가져옴
  const userInfo = useSelector((state) => state.user.info)
  const memberIndex = userInfo.userIndex;
  const loginMember = userInfo.userId; // 삭제버튼 오픈용(로그인 회원 일치)

  const [reviews, setReviews] = useState(props.reviewList);

  useEffect(() => {
    setReviews(props.reviewList);
  }, [props.reviewList]);

  // const [parentReviews, setParentReview] = useState('');

    // 모달부분
    const [modalOpen, setModalOpen] = useState(false);
    const open = () => setModalOpen(true);
    const close = () => setModalOpen(false);

    // 상위댓글(layer=0) 필터
    const motherResult = reviews.filter(item=>item.layer < 1);

    // useEffect(()=>{
    //   setParentReview(motherResult);
    // },[]) 
    // 혹시 이것때문에 group 0으로 찍히는걸까봐

    const onClickDelete=async(index)=>{
      try{
        const res = await DetailApi.deleteComment(index, memberIndex);
        if(res.data.statusCode === 200){
          alert("댓글이 삭제되었습니다.")
        }
      } catch(e){
        console.log(e);
      }
    }
    const onClickUpdate=()=>{

    }

    return(
        <ReviewBodyBlock>
        {motherResult&&motherResult.map(({index,memberIndex,memberId, title, content, rate, like,group,productCode,createTime})=>(
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
                  <AlertOutlined style={{alignItem: 'baseline', color: 'red', fontSize: '1.5rem'}}
                  onClick={()=>open(index)}/>
                  {modalOpen && <AccuseModal open={open} close={close}
                  index={index}
                  memberIndex={memberIndex}
                   />}
                  {/* <Form.Label className="review-like">{like}</Form.Label> */}
              </div>
            </div>

            <div className="review-btn-container">
              {/* 로그인한 회원이랑 작성자랑2 동일하면 삭제 버튼 */}
              {memberId === loginMember && (
              <>
              <button className="review-update-btn" onClick={onClickUpdate(index)}>수정</button>
              <button className="review-delete-btn" 
                onClick={()=>onClickDelete(index)}>삭제</button>
              </>
              )}
              
          </div>
          <Alert.Heading className="review-title">{title}</Alert.Heading>
           <p className="review-content">{content}</p>
          <hr/>
          <ChildReview reviews={reviews} 
          index={index} 
          code={productCode}/>
        </Alert>
        </div>
        ))}
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
}
.review-head-container{
  display: flexbox;
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
`;