import styled from "styled-components";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from "react";
import DetailApi from "../../../../../../api/DetailApi";
import { useSelector } from 'react-redux';


// 댓글 작성

const ChildReview=(props)=>{
    // 로그인 유저 정보를 리덕스에서 가져옴
    const userInfo = useSelector((state) => state.user.info)
    const memberIndex = userInfo.userIndex;
    const [Reviews, setReviews] = useState(props.reviewList);

    useEffect(() => {
      setReviews(props.reviewList);
    }, [props.reviewList]);


    const [inputContent, setInputContent] = useState('');
    const onChangeContent=(e)=>{setInputContent(e.target.value);}

    console.log("그룹 무슨값 찍히냐" + Reviews.group);
    console.log("그룹 무슨값 찍히냐" + setReviews.group);
    console.log("그룹 무슨값 찍히냐" + props.reviewList);
    console.log("그룹 무슨값 찍히냐" + props.reviewList.group);



    let group = 79 ; // 부모댓글 글 index = 자식 댓글 group
    // let productCode = "17000544";

    const onClickSubmit=async()=>{
        const res = await DetailApi.childComment(memberIndex,group,inputContent,props.productCode);
        if(res.data.statusCode === 200){
          console.log("댓글 작성 완료 후 목록으로 이동");
        } else{
          console.log("댓글 작성 실패");
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