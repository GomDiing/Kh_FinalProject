// import styled from "styled-components";
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styled from "styled-components";
import { Rate } from "antd";
import ChildReview from "./ChildReview";



const ReviewBody=(props)=>{
    const [Reviews, setReviews] = useState(props.reviewList);
    // 댓글 보기 토글
    const [replyToggle, setReplyToggle] = useState(false);
    // 댓글 정보를 토글로 가렸다 보여주기
    const toggleReplyView = () => {
      setReplyToggle(!replyToggle)
  }

    useEffect(() => {
      setReviews(props.reviewList);
    }, [props.reviewList]);

    return(
        <ReviewBodyBlock>
        {Reviews.map(({memberId, title, content, rate, like,group,productCode})=>(
        <div>
        <Form>
        <Rate allowHalf disabled className="rate" value={rate} style={{ fontSize: '1.3rem'}}/>
        <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label className="reply-title">{title}</Form.Label>
        <Form.Label className="">{memberId}</Form.Label>
        <Form.Label>{like}</Form.Label>
        </Form.Group>
        <Form.Text className="reply-content">{content}</Form.Text>

      {/* <Form.Group className="reply-mb-3" controlId="formBasicPassword">
      <Form.Control type="text" placeholder="Write Comment" />
      <Button variant="primary" type="submit">등록</Button>
      </Form.Group> */}
      </Form>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem'}}>
          <Button style={{backgroundColor: '#FFD669', color: 'black'}} onClick={toggleReplyView}>더보기</Button></div>

          {replyToggle &&
          <div>
            <ChildReview/>
            {Reviews.map(({memberId, title, content, rate, like,group,productCode})=>(
        <div>
          <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="reply-title">댓글창</Form.Label>
          </Form.Group>
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
`;