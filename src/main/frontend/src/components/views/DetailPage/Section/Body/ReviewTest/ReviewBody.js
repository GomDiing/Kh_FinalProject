// import styled from "styled-components";
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styled from "styled-components";
import { Rate } from "antd";
import ChildReview from "./ChildReview";
import { AlertOutlined } from "@ant-design/icons";
import DetailApi from "../../../../../../api/DetailApi";
import AccuseModal from "./AccuseModal";
import { async } from "q";


const ReviewBody=(props)=>{
  // const [index, setIndex] = useState('');

    const [Reviews, setReviews] = useState(props.reviewList);
    // 댓글 보기 토글
    const [replyToggle, setReplyToggle] = useState(false);
    // const [replyToggle, setReplyToggle] = useState([]);
    console.log(props.reviewList.index);

    let memberIndex = 322;


    // 댓글 정보를 토글로 가렸다 보여주기
    const toggleReplyView = () => {
      setReplyToggle(!replyToggle)
      // if(this.state[e.target.id] !== true){
      //   this.setState(
      //     {
      //       [e.target.id] : true,
      //     }
      //   );
      // }else{
      //   this.setState(
      //     {
      //       [e.target.id] : false,
      //     }
      //   );
      // }
  };

  const [modalOpen, setModalOpen] = useState(false);
  const open = () => setModalOpen(true);
  const close = () => setModalOpen(false);
  const [rIndex, setRindex] = useState('');


    useEffect(() => {
      setReviews(props.reviewList);
    }, [props.reviewList]);

    const motherResult = Reviews.filter(item=>item.layer < 1);
    const childResult = Reviews.filter(item=>item.layer > 0);
    // const childResult = Reviews.filter(item=>item.layer > 0 && item.group===item.index);

    console.log(motherResult);

    const onClickAccuse=(index)=>{
      setModalOpen(true); 
      // setIndex(Reviews.title)
      console.log("신고한거 찍히는지");
      // setModalOpen(true)
      // alert("신고할거야?")
      // if(alert("신고하시겠습니까?")){
        // const res = await DetailApi.deleteComment(props.reviewIndex);
        // if(res.data.status === 200) {
        //   console.log("댓글 신고 완료");
        // } else{
        //   console.log("신고 실패");
        // }
      // }
    }

    const onClickDelete=async(index)=>{
      const res = await DetailApi.deleteComment(index, memberIndex); //[0] 배열 표시 해주니까 값 들어감 
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
        onClick={()=>onClickAccuse(index)}/>
            {modalOpen && <AccuseModal setModalOpen={setModalOpen} />}

          <Form.Label>{like}</Form.Label>
          </Form.Group>
          <Form.Text className="reply-content">{content}</Form.Text>
          {/* 로그인 사용자만 수정 삭제 버튼 보이게 ㅋ 하.. ㅎ */}
          <div className="mother-btn-container">
          <button className="mother-reply-btn">수정</button>
          <button className="mother-reply-btn" onClick={()=>onClickDelete(index)}>삭제</button>
          </div>

        <div style={{ display: 'flex', margin: '1rem'}}>
          <Button style={{backgroundColor: 'white', color: 'black'}} id={motherResult.index} onClick={toggleReplyView}>더보기
          </Button></div>
          {modalOpen && <AccuseModal setModalOpen={setModalOpen} />}
          </Form>
          {replyToggle &&
          <div>
            <ChildReview/>
            {childResult.map(({index,memberId,content,group,productCode,createTime})=>(
        <div key={index}>
          <Form className="child-reply-container">
          <Form.Group>
          <Form.Label className="child-reply-user">{memberId}</Form.Label>
          <Form.Label className="child-reply-time">{createTime}</Form.Label>
          <button className="child-reply-btn">수정</button>
          <button className="child-reply-btn">삭제</button>
          </Form.Group>
          <Form.Label className="child-reply-content">{content}</Form.Label>
          </Form>
        </div>
        ))}
          </div>
        }
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