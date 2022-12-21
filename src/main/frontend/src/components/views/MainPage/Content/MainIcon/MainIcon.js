import styled from "styled-components";
import {QuestionCircleOutlined, ClockCircleOutlined, DollarCircleOutlined, UserOutlined, SendOutlined, NotificationOutlined,} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../../../../../util/Modal/Modal";
import { useState } from "react";
import AnswerModalBody from "./IconModal/ModalBody/AnswerModalBody";
import IconModalHeader from "./IconModal/IconModalHeader";
import NoticeModalBody from "./IconModal/ModalBody/NoticeModalBody";
import CancelModalBody from "./IconModal/ModalBody/CancelModalBody";
import { useSelector } from "react-redux";

const MainIconContainer = styled.div`
    /* border: 1px solid black; */
    width: 100%;
    margin: 40px 0;
    .IconAllContainer{
        margin: 0 20px;
        align-items: center;
        display: flex;
        justify-content:space-between;
    }
    .MainIcon{
        display: flex;
        justify-content: center;
        font-size: 2em;
        color: #33333b;        
        opacity: 60%
    }  
    p{
        text-align: center;
        margin: 0px;
        margin-top: 5px;
        color:#33333b;
        cursor: pointer;
        /* min-width: 64px; */
    }
    h2{
        margin:0px;
        padding:0px;
    }
    span , h5{
        margin: 0px;
        padding: 0px;
        display: inline;
    }

    @media (max-width : 1024px){
        .IconContainer2{
            display: none;
        }
        .IconContainer{
            margin: 0 0.5em;
        }
        .MainIcon{
            font-size: 2.5em;
        }
    }
`


const MainIcon = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectModal , setSelectModal] = useState(0);
    const Navigate = useNavigate();

    const userInfo = useSelector((state) => state.user.info)

    const openModal = (e) =>{
        setSelectModal(e)
        setModalOpen(true)
    }
    const closeModal = () =>{
        setModalOpen(false)
    }

    // 로그인 / 비로그인 체크
    const ClickItem = (e) =>{
        if(userInfo.userIndex){
            Navigate(e)
        }else {
            console.log("flase")
            alert("로그인 후 이용해 주시길 바랍니다.")
        }
    }

    return(
    <MainIconContainer>
        <div className="IconAllContainer">

            <div className="IconContainer">
                <ClockCircleOutlined className="MainIcon" onClick={()=>{ClickItem("/MyPage/RList")}} />
                <p>예매내역</p>
            </div>
            <div className="IconContainer">
                <DollarCircleOutlined className="MainIcon" onClick={()=>{openModal(1)}}/>
                <p>취소/환불</p>
            </div>
            <div className="IconContainer">
                <UserOutlined className="MainIcon" onClick={()=>{ClickItem("/MyPage/*")}}/>
                <p>My Page</p>
            </div>
            <div className="IconContainer">
                <SendOutlined className="MainIcon" onClick={()=>{ClickItem('/MyPage/Contact')}}/>
                <p>1:1문의</p>
            </div>
            <div className="IconContainer">
                <NotificationOutlined className="MainIcon" onClick={()=>{openModal(2)}}/>
                <p>공지사항</p>
            </div>
            <div className="IconContainer"> 
                <QuestionCircleOutlined  className="MainIcon" onClick={()=>{openModal(3)}}/>
                <p>자주묻는질문</p>
            </div>

            <div className="IconContainer2">
                <h2>02-1541-1633</h2>
                <h5>평일</h5><span> AM 09:00 ~ PM 06:00</span>
                <br></br>
                <h5>휴일</h5><span> AM 09:00 ~ PM 12:00</span>
            </div>
        </div>
        {selectModal === 1 && <Modal open={modalOpen} close={closeModal} header={<IconModalHeader title = "취소/환불"/>}><div>{<CancelModalBody/>}</div></Modal>}
        {selectModal === 2 && <Modal open={modalOpen} close={closeModal} header={<IconModalHeader title = "공지사항"/>}><div>{<NoticeModalBody/>}</div></Modal>}
        {selectModal === 3 && <Modal open={modalOpen} close={closeModal} header={<IconModalHeader title = "자주묻는 질문"/>}><div>{<AnswerModalBody/>}</div></Modal>}
    </MainIconContainer>
    )
}

export default MainIcon;