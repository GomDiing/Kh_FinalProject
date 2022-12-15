import { CaretRightOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '../../../../../util/Modal/Modal';
import MapModalBody from './MapModal';

const InfoStyle = styled.div`
    * {
        font-size: 16px;
    }
    div {
        margin-top: 4rem;
    }
    .infoDesc {
        margin-top: 1rem;
        margin-left: 2rem;
    }
    .price {
        color: #ED4037;
        margin-left: 1.5rem;
        font-weight: bold;
    }
    .priceA {
        color: #ED4037;
        margin-left: 2.25rem;
        font-weight: bold;
    }
    .info {
        padding: 0 0 0 32px;
    }
    .infoBtn {
        margin-left: 1.7rem;
    }
    svg {
        vertical-align: baseline;
    }
    .modal > section > header button {
    top: 8px;
    right: 8px;
    }
    .modal > section {
        height: auto;
    }
    @media (max-width: 1225px) {
    .infoPriceList {
        margin-left: 2rem;
    }
}
`;

// 상세페이지 상단 공연 정보
function Info() {
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () =>{
        setModalOpen(true)
    }
    const closeModal = () =>{
        setModalOpen(false)
    }

    return (
        <InfoStyle>
        <div>
            <ul className="info" style={{listStyle: 'none'}}>
                <li className="infoItem">
                    <strong className="infoLabel">장소</strong>
                <span className="infoDesc">
                    <span className="infoBtn" data-popup="info-place" role="button" onClick={openModal}>
                    대성 디큐브아트센터<CaretRightOutlined/>
                    </span>
                </span>
                </li>
                <br/>
            
                <li className="infoItem">
                    <strong className="infoLabel">공연기간</strong>
                    <span span='true' className="infoDesc">
                    <span className="infoText">2022.10.05 ~2023.02.26</span>
                </span>
                </li>
                <br/>

                <li className="infoItem"><strong className="infoLabel">공연시간</strong>
                    <span className="infoDesc">
                        <span className="infoText">160분(인터미션 15분 포함)</span>
                    </span>
                </li>
                <br/>

                <li className="infoItem">
                    <strong className="infoLabel">관람연령</strong>
                    <span className="infoDesc">
                        <span className="infoText">8세이상 관람가능</span>
                    </span>
                </li>
                <br/>
                {/* <div className='hr'>
                </div> */}
            
                <li className="infoItem infoPrice">
                    <strong className="infoLabel">가격</strong>
                    <div className="infoDesc">
                        <ul className="infoPriceList" style={{listStyle: 'none'}}>
                            <li className="infoPriceItem is-largePrice">
                            </li>
                            <li className="infoPriceItem">
                                <span className="name">VIP석</span>
                                <span className="price">150,000원</span>
                            </li> <br />
                            <li className="infoPriceItem">
                                <span className="name">OP석</span>
                                <span className="price">140,000원</span>
                            </li> <br />
                            <li className="infoPriceItem">
                                <span className="name">R석</span>
                                <span className="priceA">130,000원</span>
                            </li> <br />
                            <li className="infoPriceItem">
                                <span className="name">S석</span>
                                <span className="priceA">100,000원</span>
                            </li> <br />
                            <li className="infoPriceItem">
                                <span className="name">A석</span>
                                <span className="priceA">70,000원</span>
                            </li> <br />
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
        <Modal open={modalOpen} close={closeModal} header={"찾아오시는 길"}><div>{<MapModalBody/>}</div></Modal>
        </InfoStyle>
    )
}

export default Info;