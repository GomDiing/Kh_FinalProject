import { ReactComponent as IconReply } from "../../../../../../images/icon-reply.svg";
import { ReactComponent as IconDelete } from "../../../../../../images/icon-delete.svg";
import { ReactComponent as IconEdit } from "../../../../../../images/icon-edit.svg";
import { useState } from "react";

const CommentBtn = ({commentData, setReplying, setDeleting, setDeleteModalState, setEditing}) => {
  // 대댓글 추가

  // const [Replying, setReplying] = useState(false);
  let counter = false;
  const showAddComment = () => {
    setReplying(!counter);
    // counter ? setReplying(false) : setReplying(true);
    counter = true;
  };

  // 댓글 삭제
  const showDeleteModal = () => {
    setDeleting(true);
    setDeleteModalState(true);
  };

  // 댓글 수정
  const showEditComment = () => {
    setEditing(true);
  };


  return (
    <div className="comment--btn">
      <button
        className={`reply-btn ${
          !commentData.currentUser ? "" : "display--none"
        }`}
        onClick={showAddComment}
      >
        <IconReply />댓글
      </button>
      <button
        className={`delete-btn ${
          commentData.currentUser ? "" : "display--none"
        }`}
        onClick={showDeleteModal}
      >
        <IconDelete />삭제
      </button>
      <button
        className={`edit-btn ${commentData.currentUser ? "" : "display--none"}`}
        onClick={showEditComment}
      >
        <IconEdit />수정
      </button>
    </div>
  );
};

export default CommentBtn;
