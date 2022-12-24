import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TopBar from "../Tool/TopBar";
import { useState } from "react";
import AdminApi from "../../../../api/AdminApi";

const WriteNotice=()=>{
    const navigate = useNavigate();
    const [inputTitle, setInputTitle] = useState("");
    const [inputDetail, setInputDetail] = useState("");

    const onChangeTitle=(e)=>{setInputTitle(e.target.value);}
    const onChangeDetail=(e)=>{setInputDetail(e.target.value);}

    const onClickSubmit=async()=>{
        try{
            const res = await AdminApi.writing(inputTitle, inputDetail);
            if(res.data.statusCode === 200){
                alert(res.data.message);
                navigate('/admin/noticeList')
            } 
        } catch(e){
            console.log(e);
            if(e.response.data.statusCode === 400){
                alert("제목과 내용을 입력해주세요")
            }else{
                console.log(e);
            }
        }
    };
    
    return(
        <>
        <WriteBlock>
            <TopBar name="공지사항 작성하기"/>
                <div className="notice-write-container">
                    <div className="notice-write-titlebox">
                        <div className="notice-write-title">제목
                            <input type="text" placeholder="제목을 입력하세요" value={inputTitle} onChange={onChangeTitle}/>
                        </div>
                    </div>
                    <div className="notice-write-content">
                        <textarea placeholder="내용 입력" value={inputDetail} onChange={onChangeDetail}/>
                    </div>
                    <div className="buttonWrap">
                        <button className="noticeBtn" onClick={()=>{navigate('/admin/noticeList')}}>뒤로가기</button>
                        <button className="noticeBtn" onClick={onClickSubmit}>작성</button>
                    </div>
                </div>
        </WriteBlock>
        </>
    )
}
export default WriteNotice;

const WriteBlock=styled.div`
    margin:0 auto;
    box-sizing: border-box;
    .notice-write-container{
    position: relative;
    width: 70vw;
    }
    .notice-write-titlebox{
        border-top: 1px solid black;
        border-bottom: 1px solid #dae0e9;
        height: 90px;
        padding: 0 20px;
        line-height: 70px;
    }
    .notice-write-title{
        margin: 5px;
        float: left;
        input{
            margin-left: 20px;
            height: 50px;
            width: 60vw;
            padding-left: 20px;
            border-radius: 5px;
        }
    }
    .notice-write-content{
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
            border-radius: 5px;
            /* border: #f5f5f5 4px; */
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
        background-color: #92A9BD;
        border-radius: 5px;
        width: 100px;
        height: 35px;
    }

`;