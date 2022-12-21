import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components"
import AdminApi from "../../../../../api/AdminApi";

const MainNoticeContainer = styled.div` 
    @keyframes slide{
        0%{
            transform: translateY(0);
        }
        25%{
            transform: translateY(-30px);
        }
        50%{
            transform: translateY(-60px);
        }
        75%{
            transform: translateY(-90px);
        }
        100%{
            transform: translateY(0px);
        }
    }
    height: 30px;
    overflow: hidden;
    font-family: sans-serif;
    margin: 15px 0;
    .MainNotice{
        margin: 0;
        padding: 0;
    }
    .Notice1{
        display: flex;
        align-items: center;
        animation: slide 20s ease-out infinite;
        height: 30px;
        margin: 0px;
        padding: 0px;
    }
    p{
        margin : 0 5px;
        padding: 0 5px;
        display: flex;
        justify-content: center;
        border-radius: 5px;
        background-color: #fae100;
    }
    .Noticeimg{
        width: 25px;
        height: 20px;
        margin-left: 20px;
        margin-right: 10px;
    }
    `

const MainNotice = () =>{

    const [notice , setNotice] = useState([]);

    useEffect(() =>{
        const noticeList = async() => {
            try{
                const res = await AdminApi.noticeInfo(0, 5);
                if(res.data.statusCode === 200){
                    setNotice(res.data.results.noticeDTOList);
                }

            } catch (e){
                console.log(e)
            }
        }
        noticeList(); 
    },[])

    return(
        <MainNoticeContainer>
            <div className="MainNotice">
                {notice.map((notice ,index)=>(
                    <div className="Notice1" key = {index}>
                        <img className="Noticeimg" src="https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/6562f7bc017800001.png?type=thumb&opt=C72x72.fwebp" alt=""></img>
                        <p>Notice</p>
                        <span >{notice.content}</span>
                        <br></br>
                    </div>
                ))}
            </div>
        </MainNoticeContainer>
    )
}

export default MainNotice