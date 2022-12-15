import { AlertOutlined } from "@ant-design/icons";
import { Rate } from "antd";
import { useState } from "react";

const CommentHeader = ({commentData, time}) => {
    // 별점
    const [rate, setRate] = useState(4);
    // const handleRate = (rate) => {
    //   setRate(rate);
    // }

  return (
    <div className="comment--header">
      <div className="username">{commentData.username}</div>
      {commentData.currentUser ? <div className="you-tag">You</div> : ""}
      <div className="comment-posted-time">{`${time}전`}</div>
      <div className="reportBt"><AlertOutlined style={{alignItem: 'baseline', color: 'red', fontSize: '1rem'}}/></div>
      <div>
      <Rate allowHalf disabled className="rate" value={rate} style={{ fontSize: '1.3rem'}}/>
      </div>
    </div>
  );
};

export default CommentHeader;
