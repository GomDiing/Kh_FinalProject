import styled from 'styled-components'
import { useState, useEffect } from 'react'
import AdminApi from '../../../../../api/AdminApi'
import { Rate } from "antd";
import {HeartOutlined} from "@ant-design/icons/lib/icons";



const RecentComment=()=>{
    const [reviewList, setReviewList] = useState('');
      /** 최신 후기 목록을 가져오는 useEffect */
  useEffect(() => {
    const reviewData = async()=> {
      try {
        const res = await AdminApi.recentReview();
        console.log("데이터 값 : " + res.data.results);
        if(res.data.statusCode === 200){
          setReviewList(res.data.results);
          console.log(res.data.results);
        }else{
          alert("리스트 조회가 안됩니다.")
      } 
    }catch (e) {
        console.log(e);
      }
    };
    reviewData();
  }, []);

    return(
        <RecentWrap>
        <div className="comment-container">
            {reviewList&&reviewList.map(({index,memberId, title, like, rate, content,createTime}) =>(
            <div className="ReviewBox"  key={memberId}>
                <li className="MainReviewContents">
                    <div className='review-top'>
                        <div className="minititle">{title}</div>
                        <Rate allowHalf disabled className="rate" value={rate} style={{ fontSize: '1.3rem'}}/>
                        <div className="mini-user">{memberId} | </div>
                        <div className="mini-time"> {createTime}</div>
                        <button className='like-button' type='disabled'>
                            <HeartOutlined color='red'/>
                            <div className="mini-like" >{like}</div>
                        </button>
                        
                    </div>
                <hr></hr>
                <div className="ReviewContents">
                    <p className="con">{content}</p>
                </div>
                </li>
            </div>
            ))}
        </div>
        </RecentWrap>
    )
}
export default RecentComment;

// 후기쪽에서 충돌이 나서 바꿔놨는데 혹시 이상 있으시면 알려주세요.
const RecentWrap = styled.div`
.comment-container{
    flex: 2;
    -webkit-box-shadow: 0px 0px 12px -1px #000000; 
    box-shadow: 0px 0px 12px -1px #000000;
    padding: 20px;
    margin-right: 20px;
}
.MainReviewContents{
    border: 1px solid silver;
    margin: 0 5px;
}
li{
    list-style: none;
}
.con{
    white-space: normal;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.minititle{
    margin: auto 0;
    /* text-align: center; */
    /* opacity: 90%; */
    font-size: 18px;
    font-weight: bolder;
    text-overflow: ellipsis;
    overflow:hidden;
    white-space: nowrap;
}
.review-top{
    display: flex;
}
.mini-user{
    margin-right: 0;
}
.like-button{
    border: none;
    background-color: white;
    display: flex;
}
`