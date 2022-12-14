import React, { useState } from 'react';
import { Rate } from 'antd';
import styled from "styled-components";

const ACWrap = styled.div`
width: 100%;
.add-comment {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px;
  background: white;
  border-radius: 10px;
  animation: come-in 0.7s ease-in-out;

  .comment-input {
    position: relative;
    height: 100px;
    border: 2px solid lightgray;
    color: black;
    border-radius: 10px;
    padding: 15px 25px;
    resize: none;
    scrollbar-width: none;
    &::placeholder {
      color: black;
    }
    &::-webkit-scrollbar {
      width: 0;
    }
    &:focus {
      outline: 1.5px solid #6c757d;
    }
  }
  .btn-container {
    display: flex;
    /* align-items: center; */
    justify-content: flex-end;
  }
  .add-btn {
    color: white;
    font-weight: bold;
    border: 0;
    transition: 0.3s;
    cursor: pointer;
    padding: 8px 16px;
    color: #fff;
    background-color: #6c757d;
    border-radius: 5px;
    font-size: 13px;
    &:hover,
    &:focus{
      opacity: 0.65;
    }
    margin-right: 1rem;
  }
  .cancel-btn {
    color: white;
    font-weight: bold;
    border: 0;
    transition: 0.3s;
    cursor: pointer;
    padding: 8px 16px;
    color: #fff;
    background-color: #6c757d;
    border-radius: 5px;
    font-size: 13px;
    &:hover,
    &:focus{
      opacity: 0.65;
    }
  }
}
@keyframes come-in {
  0%{
    opacity: 0;
    transform: translateY(-100%);
  }
  75%{
    opacity: 0;
    transform: translateY(-50%);
  }
  100%{
    opacity: 1;
    transform: translateY(0);
  }
}
`

const WModal = styled.div`
.modal {
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.6);
}
.modal button {
  outline: none;
  cursor: pointer;
  border: 0;
  margin: 0 5px;
}
.modal > section {
  width: 90%;
  max-width: 4500px;
  width: 700px;
  height: auto;
  margin: 0 auto;
  border-radius: 0.3rem;
  background-color: #fff;
  /* 팝업이 열릴때 스르륵 열리는 효과 */
  animation: modal-show 0.3s;
  overflow: hidden;
}
.modal > section > header {
  position: relative;
  padding: 16px 64px 16px 16px;
  background-color: #f1f1f1;
  font-weight: 700;
}
.modal > section > header button {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 30px;
  font-size: 21px;
  font-weight: 700;
  text-align: center;
  color: #999;
  background-color: transparent;
}
.modal > section > main {
  padding: 16px;
  border-bottom: 1px solid #dee2e6;
  border-top: 1px solid #dee2e6;
}
.modal > section > footer {
  padding: 12px 16px;
  text-align: right;
}
.add-btn {
  padding: 6px 12px;
  color: #fff;
  background-color: #6c757d;
  border-radius: 5px;
  font-size: 13px;
}
.cancel-btn {
  padding: 6px 12px;
  color: black;
  background-color: #dee2e6;
  border-radius: 5px;
  font-size: 13px;
}
.modal.openModal {
  display: flex;
  align-items: center;
  /* 팝업이 열릴때 스르륵 열리는 효과 */
  animation: modal-bg-show 0.3s;
}
@keyframes modal-show {
  from {
      opacity: 0;
      margin-top: -50px;
  }
  to {
      opacity: 1;
      margin-top: 0;
  }
  }
@keyframes modal-bg-show {
  from {
      opacity: 0;
  }
  to {
      opacity: 1;
  }
}
`

function WriteReview(props) {
  const { buttonValue, addComments, replyingTo, open, close } = props;

  // 별점
  const [value, setValue] = React.useState(0);

  function handleChange(value) {
      setValue(value);
  }

  const replyingToUser = replyingTo ? `@${replyingTo}, ` : "";
  const [comment, setComment] = useState("");

  const clickHandler = () => {
    if (comment === "" || comment === " ") return;

    const newComment = {
      id: Math.floor(Math.random() * 100) + 5,
      content: replyingToUser + comment,
      createdAt: new Date(),
      username: "hjm8727",
      currentUser: true,
      replies: [],
    };
    addComments(newComment);
    setComment("");
    close(true);
    setValue(value);
  };


  return (
<WModal>
    <div className={open ? 'openModal modal' : 'modal'}>
    {open && 
        <section>
          <header>
          작품명
            <button className='close' onClick={close}>
              &times;
            </button>
          </header>
          <main>
            <Rate allowHalf value={value} onChange={handleChange} style={{ fontSize: '1.8rem'}}/>
            <ACWrap>
              <div className="add-comment">
                <textarea
                  className="comment-input"
                  placeholder="댓글을 작성해 보세요."
                  value={replyingToUser + comment}
                  onChange={(e) => {
                    setComment(
                      e.target.value.replace(replyingTo ? `@${replyingTo}, ` : "", "")
                    );
                  }}
                />
              </div>
              </ACWrap>
          </main>
          <footer>
            <div className="btn-container">
              <button className="add-btn" onClick={clickHandler}>
                {buttonValue}
              </button>
              <button className="cancel-btn" onClick={close}>
                  취소
              </button>
            </div>
          </footer>
        </section>
    }
    </div>
    </WModal>
  );
}

export default WriteReview;
