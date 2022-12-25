import styled from "styled-components";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from "react";
import DetailApi from "../../../../../../api/DetailApi";
import { useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import { useNavigate} from "react-router-dom";


// 댓글 작성
const ChildReview=(props)=>{
    // 로그인 유저 정보를 리덕스에서 가져옴
    const userInfo = useSelector((state) => state.user.info)
    const memberIndex = userInfo.userIndex;
    const loginMember = userInfo.userId; // 댓글 삭제시 작성 회원만 버튼 보이게

    console.log(props.child_comment_list);
    const navigate = useNavigate();

    const [inputContent, setInputContent] = useState('');
    const onChangeContent=(e)=>{setInputContent(e.target.value);}
    const [display, setDisplay] = useState(false);

    // 댓글 토글 창
    const onClickDisplay=(e)=>{
      e.preventDefault(); //새로고침 막기
      setDisplay(!display);
    }
    // 댓글 삭제 
    const onClickDeleteReply=async(index)=>{
      console.log("댓글 인덱스" + index);
      try{
        const res = await DetailApi.deleteComment(index, memberIndex);
        // 여기서 왜 index 값이 고유글 인덱스가 아니라 해당 글 index 번째 값 나옴 
        if(res.data.statusCode === 200){
          alert(res.data.message)
          navigate(0);
        } 
    }catch(e){
        if(e.response.data.statusCode === 400){
          alert(e.response.data.message);
        } else{
          console.log(e);
        }
      }
    };

    const group = props.index; // 부모댓글 글 index = 자식 댓글 group

    // 후기 작성
    const onClickSubmit=async()=>{
      try{
        const res = await DetailApi.childComment(userInfo.userIndex,group,inputContent,props.code);
        if(res.data.statusCode === 200){
          alert(res.data.message);
          navigate(0);
        } 
      }catch(e){
        if(e.response.data.statusCode === 400){
          alert("로그인 후 이용하시기 바랍니다.")
        }else{
          console.log(e);
        }
      }
  };

    return(
      <ChildReviewInputBlock>
      <button className="reply-toggle-btn" onClick={onClickDisplay}>댓글 더보기</button>
    <Form>
      {display &&
      <div>
        <div className="sec-input-container">
        <Form.Control type="text" placeholder="Enter Reply" value={inputContent} onChange={onChangeContent}/>
         <Button className="child-submit-btn" variant="dark" 
           onClick={onClickSubmit}>
              등록
          </Button>
        </div>
      {props.child_comment_list&&props.child_comment_list.map((reply,index)=>
        <div key={index}>
          <Alert variant="light" className="reply-container">
            <div className="reply-title-container">
              <div className="reply-top-left">{reply.memberId}</div>
              <div className="reply-top-right">
              <div>{reply.createTime}</div>
              {reply.memberId === loginMember && (
                <>
              <button className="delete-reply-btn" 
              onClick={()=>onClickDeleteReply(reply.index)}>삭제</button>
              </>
            )}
            </div>
            </div>
            <div className="reply-content">{reply.content}</div>
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