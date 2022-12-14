import { useState } from "react";
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
  .send-btn-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .add-btn {
    color: white;
    font-weight: bold;
    border: 0;
    transition: 0.3s;
    cursor: pointer;
    padding: 6px 12px;
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

const AddComment = ({ buttonValue, addComments, replyingTo }) => {
  const replyingToUser = replyingTo ? `@${replyingTo}, ` : "";
  const [comment, setComment] = useState("");

  const clickHandler = () => {
    if (comment === "" || comment === " ") return;

    const newComment = {
      id: Math.floor(Math.random() * 100) + 5,
      content: replyingToUser + comment,
      createdAt: new Date(),
      username: "하정목",
      currentUser: true,
      replies: [],
    };

    addComments(newComment);
    setComment("");
  };

  return (
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
      <div className="send-btn-container">
        <button className="add-btn" onClick={clickHandler}>
          {buttonValue}
        </button>
      </div>
    </div>
    </ACWrap>
  );
};

export default AddComment;
