import styled from "styled-components";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from "react";
import { Rate } from "antd";
import DetailApi from "../../../../../../api/DetailApi";


const WriteReview=(props)=>{
    
    const [rate, setRate] = useState('');
    const [inputTitle, setInputTitle] = useState('');
    const [inputContent, setInputContent] = useState('');

    const onChangeRate =(e)=>{setRate(e);}
    const onChangeTitle=(e)=>{setInputTitle(e.target.value);}
    const onChangeContent=(e)=>{setInputContent(e.target.value);}

    let memberIndex = 322; //테스트용
    console.log("해당 공연 정보는?" + props.productCode);
    console.log("해당 공연 정보는?" + props.code);


    const onClickSubmit=async(productCode)=>{
        const res = await DetailApi.sendComment(memberIndex,inputTitle, inputContent, rate, productCode);
        if(res.data.statusCode === 200){
          console.log("공지사항 작성 완료 후 목록으로 이동");
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
        <Form.Control className="review-title" type="text" placeholder="Enter title" value={inputTitle} onChange={onChangeTitle}/>
        </Form.Group>
        <Form.Group className="mb-3">
        <Form.Control className="review-content" type="text" placeholder="Enter review" value={inputContent} onChange={onChangeContent}/>
      </Form.Group>
      <Button className="review-btn" variant="primary" type="submit" onClick={onClickSubmit}>
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
}
.review-content{
  height: 250px;
}
.star-rate{
  margin: 5px 0px;
}
.review-btn{
  float: right;
}

`;