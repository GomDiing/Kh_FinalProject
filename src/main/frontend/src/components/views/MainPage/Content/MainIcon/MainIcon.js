import styled from "styled-components";
import {QuestionCircleOutlined, ClockCircleOutlined, DollarCircleOutlined, UserOutlined, SendOutlined, NotificationOutlined,} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Modal from "../../../../../util/Modal/Modal";
import { useState } from "react";
import AnswerModalBody from "./IconModal/ModalBody/AnswerModalBody";
import IconModalHeader from "./IconModal/IconModalHeader";
import AskModalBody from "./IconModal/ModalBody/AskModalBody";
import NoticeModalBody from "./IconModal/ModalBody/NoticeModalBody";

const MainIconContainer = styled.div`
    /* border: 1px solid black; */
    width: 100%;
    margin: 30px 0;
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
    }
`


const MainIcon = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectModal , setSelectModal] = useState(0);

    const openModal = (e) =>{
        setSelectModal(e)
        setModalOpen(true)
    }
    const closeModal = () =>{
        setModalOpen(false)
    }
    
    return(
    <MainIconContainer>
        <div className="IconAllContainer">
            <div className="IconContainer">
                <Link to = "/MyPage/RList"><ClockCircleOutlined className="MainIcon" /></Link>
                <p>예매내역</p>
            </div>
            <div className="IconContainer">
                <DollarCircleOutlined className="MainIcon" />
                <p>취소/환불</p>
            </div>
            <div className="IconContainer">
                <Link to = "/MyPage/*"><UserOutlined className="MainIcon"/></Link>
                <p>My Page</p>
            </div>
            <div className="IconContainer">
                <SendOutlined className="MainIcon" onClick={()=>{openModal(4)}} />
                <p>1:1문의</p>
            </div>
            <div className="IconContainer">
                <NotificationOutlined className="MainIcon" onClick={()=>{openModal(5)}}/>
                <p>공지사항</p>
            </div>
            <div className="IconContainer"> 
                <QuestionCircleOutlined  className="MainIcon" onClick={()=>{openModal(6)}}/>
                <p>자주묻는질문</p>
            </div>

            <div className="IconContainer2">
                <h2>02-1541-1633</h2>
                <h5>평일</h5><span> AM 09:00 ~ PM 06:00</span>
                <br></br>
                <h5>휴일</h5><span> AM 09:00 ~ PM 12:00</span>
            </div>
        </div>
        
        {selectModal === 4 && <Modal open={modalOpen} close={closeModal} submit = {true} header={<IconModalHeader title = "1:1문의"/>}><div>{<AskModalBody/>}</div></Modal>}
        {selectModal === 5 && <Modal open={modalOpen} close={closeModal} header={<IconModalHeader title = "공지사항"/>}><div>{<NoticeModalBody/>}</div></Modal>}
        {selectModal === 6 && <Modal open={modalOpen} close={closeModal} header={<IconModalHeader title = "자주묻는 질문"/>}><div>{<AnswerModalBody/>}</div></Modal>}
    </MainIconContainer>
    )
}

export default MainIcon;