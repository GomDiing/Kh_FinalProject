import styled from "styled-components";
import { useNavigate, useParams} from "react-router-dom";
import TopBar from "../Tool/TopBar";
import { useState,useEffect } from "react";
import AdminApi from "../../../../api/AdminApi";

const UpdateNotice=()=>{
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams().index;

  const [inputTitle, setInputTitle] = useState("");
  const [inputDetail, setInputDetail] = useState("");
  const onChangeTitle=(e)=>{setInputTitle(e.target.value);}
  const onChangeDetail=(e)=>{setInputDetail(e.target.value);}


  const onClickSubmit =async()=> {
    console.log("클릭 찍히는지");
    console.log("param: " + params)
    console.log("inputTitle: " + inputTitle)
    console.log("inputDetail: " + inputDetail)
    const res = await AdminApi.noticeEdit(inputTitle,inputDetail,params);
    console.log("여기는 안찍힘");
    if(res.data === true){
        console.log("공지사항 수정 완료");
        alert("공지사항이 수정되었습니다.")
        navigate(`/admin/noticeDetail/${params}`)
    } else{
        console.log("수정 실패");
        console.log(res.data);
    }
  };
  
//   작성한 공지내용 가져오는 useEffect
  useEffect(() => {
    const noticeData = async()=> {
      setLoading(true);
      try {
        console.log("수정글의 index 값 :" + params); 
        const res = await AdminApi.noticeDetail(params);
        setInputTitle(res.data[0].title); // 작성한 제목 setinputtitle에 저장
        setInputDetail(res.data[0].content);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    noticeData();
  }, []);
  if (loading) {
    return <div>로딩 중...</div>;
  }

  return(
    <>
    <UpdateBlock>
        <TopBar name="공지사항 수정하기"/>
            <div className="notice-update-container">
                <div className="notice-update-titlebox">
                    <div className="notice-update-title">제목
                        <input type="text" placeholder="제목을 입력하세요" value={inputTitle} onChange={onChangeTitle}/>
                    </div>
                </div>
                <div className="notice-update-content">
                    <textarea placeholder="내용 입력" value={inputDetail} onChange={onChangeDetail}/>
                </div>
                <div className="buttonWrap">
                    <button className="noticeBtn" onClick={()=>{navigate(`/admin/noticeDetail/${params}`)}}>뒤로가기</button>
                    <button className="noticeBtn" onClick={onClickSubmit}>수정하기</button>
                </div>
            </div>
    </UpdateBlock>
    </>
  )
}
export default UpdateNotice;

const UpdateBlock=styled.div`
    margin:0 auto;
    box-sizing: border-box;
    .notice-update-container{
    position: relative;
    width: 70vw;
    }
    .notice-update-titlebox{
        border-top: 1px solid black;
        border-bottom: 1px solid #dae0e9;
        height: 90px;
        padding: 0 20px;
        line-height: 70px;
    }
    .notice-update-title{
        margin: 5px;
        float: left;
        input{
            margin-left: 20px;
            height: 50px;
            width: 60vw;
            padding-left: 20px;
        }
    }
    .date{
        float: right;
    }
    .notice-update-content{
        display: block;
        height: 520px;
        border-bottom: 1px solid #dae0e9;
        textarea{
            height: 480px;
            width: 100%;
            margin-top: 20px;
            padding-left: 20px;
            padding-top: 20px;
            resize: none;
        }
    }
    .buttonWrap{
        text-align: center;
        justify-content: center;
    }
    .noticeBtn{
        border: none;
        margin: 15px 0;
        margin: 20px 10px;
        background-color: #f5f5f5;
        border-radius: 5px;
        width: 150px;
        height: 50px;
    }
`;