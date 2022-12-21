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

    const [reviews2, setReviews2] = useState(props.reviews);
    const childResult = reviews2.filter(item=>item.layer > 0);

    console.log("child index 찍힌값 " + props.index);
    console.log("child 찍힌값 " + reviews2.index);
    console.log("댓글");
    console.log(reviews2);
    console.log(reviews2[0].content);


    const [inputContent, setInputContent] = useState('');
    const onChangeContent=(e)=>{setInputContent(e.target.value);}
    // debugger;

    const onClickDisplay=(e)=>{
      e.preventDefault(); //새로고침 막기
      setDisplay(!display);
      console.log("클릭값" + e);
    }

    let group = 79 ; // 부모댓글 글 index = 자식 댓글 group
    // let productCode = "17000544";

    const onClickSubmit=async(props)=>{
        const res = await DetailApi.childComment(memberIndex,group,inputContent,props.productCode);
        if(res.data.statusCode === 200){
          console.log("댓글 작성 완료 후 목록으로 이동");
        } else{
          console.log("댓글 작성 실패");
        }
      }
      const [display, setDisplay] = useState(false);
      // const [local, setLocal] = useState([])

    return(
        <ChildReviewInputBlock>
        <Form>
          {/* <button onClick={()=>{setDisplay(!display)}}> 댓글2버튼열기 */}
          <button onClick={onClickDisplay}> 더보기
         </button>


          {display &&
          <div>
          <Form.Control type="text" placeholder="Enter Reply" value={inputContent} onChange={onChangeContent}/>
          <button>작성</button>
          {childResult.map(comment=>
            <div key={comment.index}>
              <div>아이디 : {comment.memberId}</div>
              <div>내용 : {comment.content}</div>
            </div>
            )}
            </div>
          }

        {/* <Form.Group className="child-reply-input-container">
        <Form.Control type="text" placeholder="Enter Reply" value={inputContent} onChange={onChangeContent}/>
       <Button className="child-submit-btn" variant="primary" type="submit" 
       onClick={onClickSubmit}>
        등록
      </Button>
        </Form.Group> */}
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