import styled from 'styled-components'
import { useState, useEffect } from 'react'
import AdminApi from '../../../../../api/AdminApi'
import { Rate } from "antd";
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';


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
        }
      }catch(e){
        console.log(e);
      }
    }
    reviewData();
  }, []);

    return(
        <RecentWrap>
        <div className="comment-container">
        <button class="button-53">관람 후기</button>

            {reviewList&&reviewList.map(({index,memberId, title, like, rate, content,createTime,thumb_poster_url}) =>(
            // <div key={index}>
            <Alert key={index} variant="light" className="first-comment-container">
                <div className='review-image-container'>
                    <img src={thumb_poster_url} alt=''/>
                </div>
                <div className='review-text-container'>
                    <div className="review-head-container">
                        <div className="review-head-left">
                        <Rate allowHalf disabled className="rate" value={rate} style={{ fontSize: '1.7rem'}}/>
                        </div>
                        <div className="review-head-right">
                            <Form.Label className="review-id">{memberId}</Form.Label>
                            <Form.Label className="review-id">{createTime}</Form.Label>
                        </div>
                    </div>
                        <Alert.Heading className="review-title">{title}</Alert.Heading>
                        <p className="review-content">{content}</p>
                        <hr/>
                </div>
          </Alert>
        //   </div>
            )
            )}
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
    text-overflow: ellipsis;
    overflow:hidden;
    padding-top: 40px;
    font-family: sans-serif;
    /* white-space: nowrap; */
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
.review-head-container{
  display: flexbox;
  justify-content: space-between;

}
.review-head-right{
  float: right;
  .review-id,.review-like{
    margin-right: 20px;
  }
}
.review-title{
  width: 90%;
  margin-top: 15px;
}
.review-content{
  height: 50px;
}
img{
        width: 130px;
        height: 160px;
    }
.first-comment-container{
  /* justify-content: baseline,; */
  display: flex;
}
.review-image-container{
  flex: 1;
  flex-direction: column;

}
.review-text-container{
  flex: 5;
  flex-direction: column;
  margin-right: 20px;
  margin-left: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;


}


`