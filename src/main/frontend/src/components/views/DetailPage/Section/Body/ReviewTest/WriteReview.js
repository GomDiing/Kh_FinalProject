import styled from "styled-components";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from "react";
import { Rate } from "antd";
import DetailApi from "../../../../../../api/DetailApi";
import { useSelector } from 'react-redux';


const WriteReview=(props)=>{
    // 로그인 유저 정보를 리덕스에서 가져옴
    const userInfo = useSelector((state) => state.user.info)
    const memberIndex = userInfo.userIndex;

    const [rate, setRate] = useState('');
    const [inputTitle, setInputTitle] = useState('');
    const [inputContent, setInputContent] = useState('');

    const onChangeRate =(e)=>{setRate(e);}
    const onChangeTitle=(e)=>{setInputTitle(e.target.value);}
    const onChangeContent=(e)=>{setInputContent(e.target.value);}

    console.log("해당 공연 정보는?" + props.code);

    const onClickSubmit=async()=>{
        const res = await DetailApi.sendComment(memberIndex,inputTitle,inputContent,rate, props.code);
        if(res.data.statusCode === 200){
          console.log("후기 작성 완료 후 목록으로 이동");
          alert("공연 후기 작성 성공")
        } else{
          console.log("공지사항 작성 실패");
        }
      }
    return(
        <WriteReviewBlock>
        <Form className="write-review-container">
        <Rate allowHalf className="star-rate" value={rate} style={{ fontSize: '2.3rem'}}
        onChange = {onChangeRate}/>
        <Form.Group className="mb-2">
        <Form.Control className="write-review-title" type="text" placeholder="Enter title" value={inputTitle} onChange={onChangeTitle}/>
        </Form.Group>
        <Form.Group className="mb-3">
        <Form.Control className="write-review-content" type="text" placeholder="Enter review" value={inputContent} onChange={onChangeContent}/>
      </Form.Group>
      <Button className="write-review-btn" variant="primary" type="submit" onClick={onClickSubmit}>
        후기 작성하기
      </Button>
    </Form>
    <br/>
    </WriteReviewBlock>
    );

}
export default WriteReview;

const WriteReviewBlock=styled.div`
.mb-2{
    display: flex;
}
.write-review-container{
  width: 50vw;
  margin: 0 20px ;
  margin-bottom: 50px;
}
.write-review-content{
  height: 100px;
}
.star-rate{
  margin: 5px 0px;
}
.write-review-btn{
  float: right;
}

`;