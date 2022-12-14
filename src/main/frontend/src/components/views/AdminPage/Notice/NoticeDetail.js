import styled from "styled-components";
import TopBar from "../Tool/TopBar";
import React, { useState, useEffect, useHistory} from "react";
import { useNavigate, useParams, Link} from "react-router-dom";
import AdminApi from "../../../../api/AdminApi";


const NoticeDetail=()=>{
  const params = useParams().index;
  const [noticeDetail, setNoticeDetail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const noticeData = async()=> {
    //  setLoading(true);
      try {
        console.log(params);
        const response = await AdminApi.noticeDetail(params);
        setNoticeDetail(response.data);
        console.log(response.data);
      } catch (e) {
        console.log(e);
      }
      // setLoading(false);
    };
    noticeData();
  }, []);

  const onClickDelete=async()=>{
    const res = await AdminApi.noticeDelete(params);
    console.log("삭제 되었습니다.");
    alert("삭제 되었습니다.");
    navigate('/admin/noticeList');
  };
  
    return(
        <>
        <DetailBlock>
            <TopBar name="공지사항 상세보기"/>
              {noticeDetail && noticeDetail.map(({index,title,content,createDate})=>(
                <React.Fragment key={index}>
              <div className="notice-detail-container">
                <div className="notice-detail-titlebox">
                  <div>
                      <p className="notice-detail-date">{index}</p>
                      <p className="notice-detail-title">{title}</p>
                  </div>
                </div>
                  <div className="notice-detail-content">{content}</div>
              </div>
              </React.Fragment>
              ))}
                <div className="buttonWrap">
                    <button className="noticeBtn" onClick={()=>{navigate('/admin/noticeList')}}>목록으로</button>
                    <button className="noticeBtn" onClick={()=>{navigate(`/admin/noticeUpdate/${params}`)}}>수정하기</button>
                    <button className="noticeBtn" onClick={onClickDelete}>삭제하기</button>
                </div>
        </DetailBlock>
        </>
    )
}
export default NoticeDetail;

const DetailBlock=styled.div`
  margin:0 auto;
  box-sizing: border-box;
    .notice-detail-container{
    margin: 0 auto;
    position: relative;
    width: 70vw;
    margin : 10px;
    display: flex;
    border: 1px solid black;
    height: 60%;
    flex-direction: column;
    text-align: center;
    padding: 3rem;
    }
    .notice-detail-titlebox{
        align-items: center;
        overflow: hidden;
        border-top: 1px solid black;
        border-bottom: 1px solid #dae0e9;
        height: 90px;
        padding: 0 20px;
        line-height: 70px;
    }
    .notice-detail-date{
        float: right;
    }
    .notice-detail-content{
        margin-top : 20px;
        /* display: block; */
        height: 500px;
        border-bottom: 1px solid #dae0e9;
    }
    .buttonWrap{
        text-align: center;
        justify-content: center;
    }
    .noticeBtn{
      border: none;
      margin: 15px 0;
      margin: 20px 10px;
      background-color: #92A9BD;
      border-radius: 5px;
      width: 150px;
      height: 50px;
    }
`;