import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import styled from 'styled-components';

const QnaStyle = styled.div `
  .qna-top {
    /* position: relative; */
    padding: 1.5rem 2rem;
    margin-bottom: 2.5rem;
    background-color: lightgreen;
    border-radius: 0.8rem;
    border: 0.1rem solid #ecf0f6;
    box-sizing: border-box;
    width: 50rem;
    margin-top: 2rem;
    margin-left: -.5rem;
  }
  .req-button {
    width: 7rem;
    height: 3rem;
    margin-left: 5rem;
    border: none;
    background-color: beige;
    font-weight: bold;
    color: brown;
  }
  .qna-info {
    float: right;
    font-size: 16px;
    margin-right: 20px;
  }
  .qna-content {
    cursor: pointer;
    font-size: 16px;
  }
  .qna-recoment {
    color: #0F5132;
    font-weight: 500;
    font-size: 16px;
  }
  .qna-reply-wrap {
    margin-top: 2.5rem;
  }
  .qna-reply-text {
    width: 650px;
    display: inline-block;
    vertical-align: middle;
    height: 75px;
    resize: none;
    border: none;
  }
  .qna-reply-text:focus {
    outline: none;
    border: 2px solid #0F5132;
  }
  .qna-reply-button {
    float: right;
    width: 80px;
    height: 75px;
    border: none;
    background-color: yellowgreen;
  }
  .qna-reply-button:hover {
    background-color: lightgreen;
    border-radius: 12rem;
    border: none;
    color: black;
    transition-property: background-color, border-radius;
    transition-duration: 3s;
  }
  z-index: 1;

`;

const ReplyList = props => {
  const { userName, reply } = props;
  return(
    <div>
      <hr />
      <p className='qna-recoment'>{userName}님이 작성하신 답변입니다. | 2022.12.08</p>
      <p className="mb-0">
        {reply}
      </p>
    </div>
  )
} 

// Q & A
function Qna() {
  const [open, setOpen] = useState(false);
  const onClickContent = () => setOpen(!open);
  const [userName, setUserName] = useState('unknown');
  const [reply, setReply] = useState('');
  const [replyList, setReplyList] = useState([]);
  const [count, setCount] = useState(0);
  const [isValid, setIsValid] = useState(false);

  const onChnageText = e => setReply(e.target.value);
  const onKeyValid = e => e.target.value.length > 0 ? setIsValid(true) : setIsValid(false);

  const onReply = e => {
    const copyReplyList = [...replyList];
    copyReplyList.push(reply);
    setReplyList(copyReplyList);
    setReply('');
    setCount(count + 1);
    setOpen(true);
  }

  return (
    <QnaStyle>
      <div className='qna'>
        <h2>꼭 읽어주세요</h2>
        <div className='text'>
        게시판 운영 규정에 어긋난다고 판단되는 게시글은 사전 통보없이 블라인드 처리될 수 있습니다.<p />
        특히 티켓 매매 및 양도의 글은 발견 즉시 임의 삭제되며 전화번호, 이메일 등의 개인정보는 악용될<p /> 
        우려가 있으므로 게시를 삼가 주시기 바랍니다. 사전 경고에도 불구하고 불량 게시물을 계속적으로<p />
        게재한 게시자의 경우 <strong>TCat</strong> 게시판 작성 권한이 제한됩니다.
        </div>
        <div className='qna-top'>
          <p>
          공연에 대해서 고객간에 자유롭게 질문/답변을 하는 공간입니다. 상품, 예매, 배송 등의 <button className='req-button'>문의 하기</button><br />
          정확한 답변이 필요한 문의는 <strong>TCat</strong> 고객센터 1544-1555를 이용해주시기 바랍니다
          </p>
        </div>
      </div>
  
    <div>
      <Alert variant="success">
      <Alert.Heading>Hey, nice to see you <span className='qna-info'>wlals**** | 2022.12.08 | 답변 {count}</span></Alert.Heading>
      <p className='qna-content' onClick={onClickContent}>
        <i>Aww yeah, you successfully read this important alert message. This
        example text is going to run a bit longer so that you can see how
        spacing within an alert works with this kind of content.
        </i>
      </p>
      {open && replyList.map((comment, i) => {
        return(
          <ReplyList
            userName={userName}
            reply={comment}
            key={i}
          />
        )
      })}
        <div className='qna-reply-wrap'>
        <textarea className='qna-reply-text' onChange={onChnageText} value={reply} onKeyUp={onKeyValid} /><button type='button' disabled={isValid ? false : true} onClick={onReply} className='qna-reply-button'>등록</button>
        </div>
    </Alert>
    </div>
  </QnaStyle>
  )
};

export default Qna;