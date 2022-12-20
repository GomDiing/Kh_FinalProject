import styled from "styled-components";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from "react";
import { Rate } from "antd";
import DetailApi from "../../../../../../api/DetailApi";


const WriteReview=()=>{
    const [rate, setRate] = useState('');
    const [inputTitle, setInputTitle] = useState('');
    const [inputContent, setInputContent] = useState('');

    const onChangeRate =(e)=>{setRate(e);}
    const onChangeTitle=(e)=>{setInputTitle(e.target.value);}
    const onChangeContent=(e)=>{setInputContent(e.target.value);}

    let productCode = 17000544; //테스트용
    let memberIndex = 1; //테스트용

    const onClickSubmit=async()=>{
        const res = await DetailApi.sendComment(memberIndex,inputTitle, inputContent, rate, productCode);
        if(res.data.statusCode === 200){
          console.log("공지사항 작성 완료 후 목록으로 이동");
        } else{
          console.log("공지사항 작성 실패");
        }
      }
    return(
        <WriteReviewBlock>
        <Form>
        <Form.Group className="mb-2">
        <Form.Label>제목</Form.Label>
        <Form.Control className="review-title" type="text" placeholder="Enter title" value={inputTitle} onChange={onChangeTitle}/>
        <Rate allowHalf className="rate" value={rate} style={{ fontSize: '1.3rem'}}
        onChange = {onChangeRate}
        />
        </Form.Group>
        <Form.Group className="mb-3">
        <Form.Label>관람후기</Form.Label>
        <Form.Control type="text" placeholder="review" value={inputContent} onChange={onChangeContent}/>
      </Form.Group>
      <Button variant="primary" type="submit" onClick={onClickSubmit}>
        후기 작성하기
      </Button>
    </Form>
    </WriteReviewBlock>

    );

}
export default WriteReview;

const WriteReviewBlock=styled.div`
.mb-2{
    display: flex;
}
.review-title{
    width: 500px;
    margin: 0 20px ;
}

`;