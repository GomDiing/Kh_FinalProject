import { AlertOutlined } from "@ant-design/icons";
import { Rate } from "antd";
import { useState } from "react";
import DetailApi from "../../../../../../api/DetailApi";


const CommentHeader = ({commentData, time}) => {
    // 별점
    const [rate, setRate] = useState(4);
    // const handleRate = (rate) => {
    //   setRate(rate);
    // }

    const [reviewIndex, setReviewIndex] = useState("1");

    const onClickAccuse=async()=>{
      // if(alert("신고하시겠습니까?")){
        const res = await DetailApi.deleteComment(reviewIndex);
        if(res.data.status === 200) {
          console.log("댓글 신고 완료");
        } else{
          console.log("신고 실패");
        }
      // }
    }

  return (
    <div className="comment--header">
      <div className="username">{commentData.username}</div>
      {commentData.currentUser ? <div className="you-tag">You</div> : ""}
      <div className="comment-posted-time">{`${time}전`}</div>
      <div className="reportBt">
        <AlertOutlined style={{alignItem: 'baseline', color: 'red', fontSize: '1rem'}}
        onClick={onClickAccuse}/>
      </div>
      <div>
      <Rate allowHalf disabled className="rate" value={rate} style={{ fontSize: '1.3rem'}}/>
      </div>
    </div>
  );
};

export default CommentHeader;
