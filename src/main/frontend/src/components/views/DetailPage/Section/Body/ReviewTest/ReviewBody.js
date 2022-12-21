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

const ReviewBody=(props)=>{
  // 로그인 유저 정보를 리덕스에서 가져옴
  const userInfo = useSelector((state) => state.user.info)
  const memberIndex = userInfo.userIndex;

    const [reviews, setReviews] = useState(props.reviewList);

    const [motherReviews, setMotherReview] = useState([]);

    console.log("그룹값 : " + reviews.group); //undefined
    console.log("그룹값 : " + props.reviewList.group); //undefined
    console.log(reviews); // 이건 찍힘
    console.log(reviews.group); //undefined
    console.log("그룹값33 : " + props.reviewList); //undefined


    // 댓글 보기 토글
    const [replyToggle, setReplyToggle] = useState(false);
    // const [replyToggle, setReplyToggle] = useState([]);
    console.log(props.reviewList.index);

    // 모달부분
    const [modalOpen, setModalOpen] = useState(false);
    const open = () => setModalOpen(true);
    const close = () => setModalOpen(false);

    // 댓글 정보를 토글로 가렸다 보여주기
    const toggleReplyView = (index) => {
      console.log(index);
      console.log("토클 버튼 클릭시 토글 찍힌값 : "+index);
      // console.log(replyToggle.index);
      setReplyToggle(!replyToggle)
  };

    useEffect(() => {
      setReviews(props.reviewList);
    }, [props.reviewList]);

    // useEffect(()=>{
    //   setMotherReview(motherResult);
    // },[motherReviews]);


    const motherResult = reviews.filter(item=>item.layer < 1);
    const motherIndex = reviews.group;

    // const motherGroup = reviews.filter(item=>item.group)

    console.log("부모그룹");
    console.log(motherIndex);
    // const childResult = reviews.filter(item=>item.layer > 0);
    // const childResult = reviews.filter(item=>item.layer > 0 && item.group === motherIndex);

    // console.log(motherResult);

    const onClickDelete=async(index)=>{
      const res = await DetailApi.deleteComment(index, memberIndex);
      if(res.data.statusCode === 200){
        alert("댓글이 삭제되었습니다.")
      }
    }

    return(
        <ReviewBodyBlock>
        {motherResult.map(({index,memberId, title, content, rate, like,group,productCode})=>(
          // 배열 key 값 index로 잡음(글 고유 index)
        <div key={index}>
        <Form className="mother-comment-container">
          <Rate allowHalf disabled className="rate" value={rate} style={{ fontSize: '1.3rem'}}/>
          <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="reply-title">{title}</Form.Label>
          <Form.Label className="">{memberId}</Form.Label>

          {/* 신고 버튼  */}
          <AlertOutlined style={{alignItem: 'baseline', color: 'red', fontSize: '1rem'}}
          onClick={open}/>
          {modalOpen && <AccuseModal open={open} close={close} />}

          <Form.Label>{like}</Form.Label>
          </Form.Group>
          <Form.Text className="reply-content">{content}</Form.Text>
          {/* 로그인 사용자만 수정 삭제 버튼 보이게 ㅋ 하.. ㅎ */}
          <div className="mother-btn-container">
          <button className="mother-reply-btn">수정</button>
          <button className="mother-reply-btn" 
          onClick={()=>onClickDelete(index)}>삭제</button>
          </div>
          {/* 부모 댓글 index 넘겨서 비교하기 */}
          <ChildReview reviews={reviews} index={motherReviews.index}/>
        </Form>
        </div>
        ))}
        </ReviewBodyBlock>
    )
}
export default ReviewBody;

const ReviewBodyBlock = styled.div`
.reply-mb-3{
  display: flex;
}
.reply-title{
  width: 90%;
}
.reply-content{
  width: 500px;
  height: 450px;
}
.mother-comment-container{
  width: 50vw;
  margin: 0 20px ;
  border: solid 1px black;
}
.mother-btn-container{
  float: right;
}

.child-reply-container{
  width: 50vw;
  margin: 0 20px ;
}
`;