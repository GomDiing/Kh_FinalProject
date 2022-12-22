import styled from "styled-components";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from "react";
import DetailApi from "../../../../../../api/DetailApi";
import { useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';

// 댓글 작성

const ChildReview=(props)=>{
    // 로그인 유저 정보를 리덕스에서 가져옴
    const userInfo = useSelector((state) => state.user.info)
    const memberIndex = userInfo.userIndex;

    const [reviews2, setReviews2] = useState(props.reviews);

    const childResult = reviews2.filter(item=>item.layer>0 &&(item.group === props.index)); // 댓글

    console.log(reviews2);
    console.log("인덱스 값 : " + props.index);

    const [inputContent, setInputContent] = useState('');
    const onChangeContent=(e)=>{setInputContent(e.target.value);}
    // debugger;
    const onClickDisplay=(e)=>{
      console.log("클릭값" + e);
      e.preventDefault(); //새로고침 막기
      setDisplay(!display);
    }

    const group = props.index; // 부모댓글 글 index = 자식 댓글 group

    const onClickSubmit=async()=>{
        const res = await DetailApi.childComment(memberIndex,group,inputContent,props.code);
        if(res.data.statusCode === 200){
          console.log("댓글 작성 완료 후 목록으로 이동");
        } else{
          console.log("댓글 작성 실패");
        }
      }
      const [display, setDisplay] = useState(false);

    return(
      <ChildReviewInputBlock>
      <button className="reply-toggle-btn" onClick={onClickDisplay}>댓글</button>
    <Form>
      {display &&
      <div>
        <div className="sec-input-container">
         
        <Form.Control type="text" placeholder="Enter Reply" value={inputContent} onChange={onChangeContent}/>
         <Button className="child-submit-btn" variant="dark" type="submit" 
           onClick={onClickSubmit}>
              등록
          </Button>
        </div>
      {childResult.map((comment,index)=>
        <div key={index}>
          <Alert variant="light" className="reply-container">
            <div className="reply-title-container">
              <div>{comment.memberId}</div>
              <div>{comment.createTime}</div>
            </div>
            <div className="reply-content">{comment.content}</div>
          </Alert>
        </div>
        )}
        </div>
      }
    </Form>
    </ChildReviewInputBlock>
    );
}
export default ChildReview;

const ChildReviewInputBlock = styled.div`
.sec-input-container{
  width: 85%;
  margin: 20px 20px ;
  display: flexbox;
}
.reply-container{
  width: 92%;
  margin: 5px 20px ;
}
.reply-title-container{
  display: flexbox;
  justify-content: space-between;
}
.reply-content{
  margin-top: 8px;
  font-size: 1.1rem;
}
.child-submit-btn{
  margin-left: 15px;
}

.reply-toggle-btn{
  background-color: transparent;
}

`;