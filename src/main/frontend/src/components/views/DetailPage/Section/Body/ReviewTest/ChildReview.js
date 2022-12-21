import styled from "styled-components";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from "react";
import DetailApi from "../../../../../../api/DetailApi";


const ChildReview=(props)=>{
    const [inputContent, setInputContent] = useState('');
    const onChangeContent=(e)=>{setInputContent(e.target.value);}

    let memberIndex = 1; // 댓글 작성자 test용
    let group = 79 ; // 부모댓글 글 index = 자식 댓글 group
    let productCode = "17000544";

    const onClickSubmit=async()=>{
        const res = await DetailApi.childComment(memberIndex,group,inputContent,props.productCode);
        if(res.data.statusCode === 200){
          console.log("공지사항 작성 완료 후 목록으로 이동");
        } else{
          console.log("공지사항 작성 실패");
        }
      }


    return(
        <ChildReviewInputBlock>
        <Form>
        <Form.Group className="child-reply-input-container">
        <Form.Control type="text" placeholder="Enter Reply" value={inputContent} onChange={onChangeContent}/>
       <Button className="child-submit-btn" variant="primary" type="submit" onClick={onClickSubmit}>
        등록
      </Button>
        </Form.Group>
        </Form>
        </ChildReviewInputBlock>
    );
}
export default ChildReview;

const ChildReviewInputBlock = styled.div`
.child-reply-input-container{
  width: 50vw;
  margin: 10px 20px ;
  display: flex;

}
.child-submit-btn{
  margin-left: 15px;
}

`;