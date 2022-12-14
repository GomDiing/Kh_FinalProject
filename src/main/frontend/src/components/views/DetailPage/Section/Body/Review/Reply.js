import { useState, useEffect } from "react";
import AddComment from "./AddComment";
import DeleteModal from "./DeleteModal";
import CommentHeader from "./CommentHeader";
import CommentFooter from "./CommentFooter";
import styled from "styled-components";

const RWrap = styled.div`
width: 100%;
.comment-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  .comment {
    display: flex;
    flex-direction: column;
    background: white;
    padding: 15px;
    border-radius: 10px;
    gap: 15px;
    animation: come-in 1s ease-in;
    &--body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
      .comment--header {
        display: flex;
        align-items: center;
        .username {
          color: black;
          font-weight: medium;
        }
        .you-tag {
          color: white;
          font-weight: regular;
          font-size: 0.9rem;
          padding: 2px 10px 3px;
          background: #86868b;
          border-radius: 3px;
          margin-left: 10px;
        }
        .comment-posted-time {
          margin-left: 15px;
          color: #86868b;
        }
        .comment--btn {
          display: none;
        }
      }
      .comment-content {
        width: 100%;
        color: black;
        opacity: 75%;
        line-height: 1.5;
        word-wrap: break-word;
        word-break: break;
        .replyingTo {
          color: #6c757d;
          font-weight: bold;
          display: inline-block;
          margin-right: 10px;
        }
      }
      .content-edit-box{
        height: 150px;
        color: #86868b;
        line-height: 1.5;
        padding: 10px 15px;
        border: 2px solid lightgray;
        border-radius: 10px;
        resize: none;
        scrollbar-width: none;
        &::-webkit-scrollbar {
          width: 0;
        }
        &:focus {
          outline: 1.5px solid #86868b;
        }
      }
      .update-btn{
        align-self: flex-end;
        width: max-content;
        color: white;
        font-weight: bold;
        padding: 15px 30px;
        background: #6c757d;
        border: 0;
        border-radius: 10px;
        transition: 0.3s;
        cursor: pointer;
        &:hover,
        &:focus{
          opacity: 0.65;
        }    
      }
    }
    &--footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .comment--btn {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-left: auto;
    button {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #6c757d;
      font-weight: bold;
      padding: 5px;
      background: transparent;
      border: none;
      border-radius: 5px;
      transition: 0.3s;
      cursor: pointer;
      &:hover,
      &:focus {
        opacity: 0.5;
      }
    }
    .delete-btn {
      color: red;
    }
  }

  .reply-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-left: 15px;
    margin-left: 15px;
    gap: 15px;
    .comment-container {
      width: 100%;
      .comment{
        animation: come-in 1s ease-in-out;
      }
    }
  }
  .add-comment {
    width: 100%;
    margin-top: 5px;
    animation-duration: 0.5s;
  }
}

.reply-container-gap .reply-container {
  margin-top: 15px;
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

const Reply = ({
  commentData,
  commentPostedTime,
  addNewReply,
  editComment,
  deleteComment,
  setDeleteModalState,
}) => {
  const [replying, setReplying] = useState(false);
  const [time, setTime] = useState("");
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(commentData.content);
  const [deleting, setDeleting] = useState(false);

  // 작성 시간
  const createdAt = new Date(commentData.createdAt);
  const today = new Date();
  var differenceInTime = today.getTime() - createdAt.getTime();

  useEffect(() => {
    setTime(commentPostedTime(differenceInTime));
  }, [differenceInTime, commentPostedTime]);

  // 대댓글
  const addReply = (newReply) => {
    addNewReply(newReply);
    setReplying(false);
  };

  const commentContent = () => {
    const text = commentData.content.trim().split(" ");
    const firstWord = text.shift().split(",");

    return !editing ? (
      <div className="comment-content">
        <span className="replyingTo">{firstWord}</span>
        {text.join(" ")}
      </div>
    ) : (
      <textarea
        className="content-edit-box"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
      />
    );
  };

  const updateComment = () => {
    editComment(content, commentData.id, "reply");
    setEditing(false);
  };

  // 댓글 삭제
  const deleteReply = () => {
    deleteComment(commentData.id, "reply");
    setDeleting(false);
  };

  return (
    <RWrap>
    <div
      className={`comment-container ${
        commentData.replies[0] !== undefined ? "gap" : ""
      }`}
    >
      <div className="comment">
        <div className="comment--body">
          <CommentHeader
            commentData={commentData}
            setReplying={setReplying}
            setDeleting={setDeleting}
            setDeleteModalState={setDeleteModalState}
            setEditing={setEditing}
            time={time}
          />

          {commentContent()}
          {editing && (
            <button className="update-btn" onClick={updateComment}>
              수정
            </button>
          )}
        </div>
        <CommentFooter
          commentData={commentData}
          setReplying={setReplying}
          setDeleting={setDeleting}
          setDeleteModalState={setDeleteModalState}
          setEditing={setEditing}
        />
      </div>

      {replying && (
        <AddComment
          buttonValue={"댓글 작성"}
          addComments={addReply}
          replyingTo={commentData.username}
        />
      )}
      {commentData.replies.map((reply) => (
        <Reply
          key={reply.id}
          commentData={reply}
          commentPostedTime={commentPostedTime}
          addReply={addReply}
        />
      ))}

      {deleting && (
        <DeleteModal
          setDeleting={setDeleting}
          deleteComment={deleteReply}
          setDeleteModalState={setDeleteModalState}
        />
      )}
    </div>
    </RWrap>
  );
};

export default Reply;
