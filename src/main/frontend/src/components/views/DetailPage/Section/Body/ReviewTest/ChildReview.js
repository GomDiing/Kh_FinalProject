import styled from "styled-components";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from "react";
import DetailApi from "../../../../../../api/DetailApi";
import { useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import Detail from "../../../Detail";

// 댓글 작성

const ChildReview=(props)=>{
    // 로그인 유저 정보를 리덕스에서 가져옴
    const userInfo = useSelector((state) => state.user.info)
    const memberIndex = userInfo.userIndex;
    const loginMember = userInfo.userId; // 댓글 삭제시 작성 회원만 버튼 보이게

    const [reviews2, setReviews2] = useState(props.reviews);

    const childResult = reviews2.filter(item=>item.layer>0 &&(item.group === props.index)); // 댓글

    const [inputContent, setInputContent] = useState('');
    const onChangeContent=(e)=>{setInputContent(e.target.value);}

    // 댓글 토글 창
    const onClickDisplay=(e)=>{
      e.preventDefault(); //새로고침 막기
      setDisplay(!display);
    }

    const onClickDeleteReply=async(index)=>{
      try{
        const res = await DetailApi.deleteComment(index, memberIndex);
        // 여기서 왜 index 값이 고유글 인덱스가 아니라 해당 글 index 번째 값 나옴 
        if(res.data.statusCode === 200){
          console.log("댓글이 삭제되었습니다.");
          alert("댓글이 삭제되었습니다.")
        } else{
          console.log("댓글을 삭제할 수 없습니다.");
        }
      } catch(e){
        console.log(e);
      }
    };

    const group = props.index; // 부모댓글 글 index = 자식 댓글 group

    const onClickSubmit=async()=>{
      try{
        const res = await DetailApi.childComment(memberIndex,group,inputContent,props.code);
        if(res.data.statusCode === 200){
          console.log("댓글 작성 완료 후 목록으로 이동");
          alert("댓글 작성 성공!")
          return;
        } else{
          console.log("댓글 작성 실패");
        }
      } catch(e){
        console.log(e);
    }
  }

      const [display, setDisplay] = useState(false);

    return(
      <ChildReviewInputBlock>
      <button className="reply-toggle-btn" onClick={onClickDisplay}>댓글 더보기</button>
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
      {childResult.map((comment,index,memberId)=>
        <div key={index}>
          <Alert variant="light" className="reply-container">
            <div className="reply-title-container">
              <div className="reply-top-left">{comment.memberId}</div>
              <div className="reply-top-right">
              <div>{comment.createTime}</div>
              {memberId !== loginMember && (
                <>
              {/* 로그인회원이랑 댓글 작성자랑 같아야 삭제 버튼 뜨는건데 왜.. */}
              <button className="delete-reply-btn" onClick={()=>onClickDeleteReply(index)}>삭제</button>
              </>
            )}
            </div>
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
.reply-top-right{
  float: right;
  display: flex;
}
.reply-content{
  margin-top: 8px;
  font-size: 1.1rem;
}
.child-submit-btn{
  margin-left: 15px;
}

button.reply-toggle-btn{
  background-color: transparent;
  border: none;
}

button.delete-reply-btn{
  background-color: transparent;
  border: none;
  float: right;
  color: red;
}

`;