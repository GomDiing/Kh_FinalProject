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

  const [reviews, setReviews] = useState(props.reviewList);

  useEffect(() => {
    setReviews(props.reviewList);
  }, [props.reviewList]);

  const [motherReviews, setMotherReview] = useState([]);

    console.log("그룹값 : " + reviews.group); //undefined
    console.log("그룹값 : " + props.reviewList.group); //undefined
    console.log(reviews); // 이건 찍힘
    console.log("그룹값33 : " + props.reviewList); //undefined

    // 모달부분
    const [modalOpen, setModalOpen] = useState(false);
    const open = () => setModalOpen(true);
    const close = () => setModalOpen(false);

    // useEffect(()=>{
    //   setMotherReview(motherResult);
    // },[motherReviews]);

    const motherResult = reviews.filter(item=>item.layer < 1);

    const onClickDelete=async(index)=>{
      const res = await DetailApi.deleteComment(index, memberIndex);
      if(res.data.statusCode === 200){
        alert("댓글이 삭제되었습니다.")
      }
    }

    return(
        <ReviewBodyBlock>
        {motherResult.map(({index,memberId, title, content, rate, like,group,productCode,createTime})=>(
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
                  onClick={open}/>
                  {modalOpen && <AccuseModal open={open} close={close} />}
                  <Form.Label className="review-like">{like}</Form.Label>
              </div>
            </div>
            <div className="review-btn-container">
              <button className="review-update-btn">수정</button>
              <button className="review-delete-btn" 
                onClick={()=>onClickDelete(index)}>삭제</button>
          </div>
          <Alert.Heading className="review-title">{title}</Alert.Heading>
           <p className="review-content">{content}</p>
           
          <hr/>
          <ChildReview reviews={reviews} index={motherReviews.index} code={reviews.code}/>
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
  margin-bottom: 50px;

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
  height: 130px;
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
  margin-right: 20px;
}
.review-update-btn, .review-delete-btn{
  background-color: transparent;
  margin-left: 7px;
  border: none;
}
`;