import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    QuestionCircleOutlined,
    ClockCircleOutlined,
    DollarCircleOutlined,
    UserOutlined,
    SendOutlined,
    NotificationOutlined,
} from "@ant-design/icons";
import Modal from "../../../../../util/Modal/Modal";
import IconModalHeader from "./IconModal/IconModalHeader";
import AnswerModalBody from "./IconModal/ModalBody/AnswerModalBody";
import NoticeModalBody from "./IconModal/ModalBody/NoticeModalBody";
import CancelModalBody from "./IconModal/ModalBody/CancelModalBody";

const MainIconContainer = styled.div`
    width: 100%;
    margin: 40px 0;

    .IconAllContainer {
        margin: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .IconContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
    }

    .MainIcon {
        font-size: 2em;
        color: #33333b;
        opacity: 60%;
    }

    p {
        margin: 5px 0 0;
        color: #33333b;
        text-align: center;
    }
    
    h2{
        margin:0;
        padding:0;
    }
    span , h5{
        margin: 0;
        padding: 0;
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
    const [selectModal, setSelectModal] = useState(0);
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.user.info);

    // 로그인 / 비로그인 체크
    const ClickItem = (e, requiresLogin = true, modalType = null) => {
        if (requiresLogin && !userInfo.userEmail) {
            alert("로그인 후 이용해 주시길 바랍니다.");
            return;
        }

        if (modalType !== null) {
            setSelectModal(modalType);
            setModalOpen(true);
        } else if (e) {
            navigate(e);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const iconData = [
        { icon: ClockCircleOutlined, text: "예매내역", action: () => ClickItem("/MyPage/RList") },
        { icon: DollarCircleOutlined, text: "취소/환불", action: () => ClickItem(null, true, 1) },
        { icon: UserOutlined, text: "My Page", action: () => ClickItem("/MyPage/*") },
        { icon: SendOutlined, text: "1:1문의", action: () => ClickItem("/MyPage/Contact") },
        { icon: NotificationOutlined, text: "공지사항", action: () => ClickItem(null, false, 2) },
        { icon: QuestionCircleOutlined, text: "자주묻는질문", action: () => ClickItem(null, false, 3) },
    ];

    return (
        <MainIconContainer>
            <div className="IconAllContainer">
                {iconData.map((item, index) => (
                    <div key={index} className="IconContainer" onClick={item.action}>
                        <item.icon className="MainIcon" />
                        <p>{item.text}</p>
                    </div>
                ))}
                <div className="IconContainer2">
                    <h2>02-1541-1633</h2>
                    <h5>평일</h5><span> AM 09:00 ~ PM 06:00</span>
                    <br />
                    <h5>휴일</h5><span> AM 09:00 ~ PM 12:00</span>
                </div>
            </div>
            {modalOpen && (
                <Modal
                    open={modalOpen}
                    close={closeModal}
                    header={<IconModalHeader title={
                        selectModal === 1 ? "취소/환불" :
                            selectModal === 2 ? "공지사항" :
                                "자주묻는 질문"
                    } />}
                >
                    {selectModal === 1 && <CancelModalBody />}
                    {selectModal === 2 && <NoticeModalBody />}
                    {selectModal === 3 && <AnswerModalBody />}
                </Modal>
            )}
        </MainIconContainer>
    );
};

export default MainIcon;