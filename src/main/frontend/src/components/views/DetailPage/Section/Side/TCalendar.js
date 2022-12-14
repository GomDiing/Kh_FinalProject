import React, { useState } from 'react';
import Calendar from 'react-calendar';
import './calendar.css';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import PayPopup from '../Popup/PayPopup';
import PopupHeader from '../Popup/PopupHeader';
import PopupContent from '../Popup/PopupContent';
import moment from 'moment';

const Styleside = styled.div`
    .side-header{
        text-align: center;
    }
    .side-content {
        padding: 0 1.5rem;
    }
    .button {
        border: 1px solid #EF3F43;
        border-top-right-radius: 0.6rem;
        border-bottom-right-radius: 0.6rem;
        border-top-left-radius: 0.6rem;
        border-bottom-left-radius: 0.6rem;
        width: 120px;
        height: 45px;
        background-color: white;
        margin-left: 0.15rem;
        margin-right: 0.15rem;
    }
    .button:focus {
        color: #EF3F43;
    }
    .pay-button {
        width: 100%;
        height: 50px;
        font-weight: bold;
        background-color: #EF3F43;
        border: 0.1rem solid #EF3F43;
        border-radius: 1rem;
        text-align: center;
        box-sizing: border-box;
        color: #fff;
        /* margin-top: 1rem; */
        font-size: 18px;
    }
    .remain {
        margin-left: 1rem;
        padding-top: 20px;
    }
    .text-center {
        margin-bottom: 0;
    }
`;

/** 
 * 
 * Detail에서 props로 전달 받기 
 */
function TCalendar (props) {
    const { item_name, price } = props;
    const [date, setDate] = useState(new Date());
    const [modalOpen, setModalOpen] = useState(false);
    const [index, setIndex] = useState(1);
    const plusIndex = () => setIndex(index+1);
    const minusIndex = () => setIndex(index-1);

    let tat = date;
    const tas = moment(tat);
    // 현재 일
    const today = tas.format('YYYY-MM-DD');
    // 7일 전
    const cancelday = moment(tat, 'YYYY-MM-DD').subtract(7, 'day')._d.toLocaleDateString();

    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        setModalOpen(false);
        setIndex(1);
    }
    return (
        <div>
            <h3 className='text-center' style={{marginTop: '1.5rem', marginBottom: '1.5rem'}}>관람일</h3>
            <div className='calendar-container'>
            <Calendar onChange={setDate} value={date}
            formatDay={(locale, date) => date.toLocaleString("en", { day: "numeric" })}
            minDate={new Date()}
            />
            </div>
            <div className='text-center'>
            <br/>
            <span className='bold'>선택한 날짜 : </span>{' '}
            {date.toDateString("kr", { day: "numeric" })}
            <hr />
            </div>
            <Styleside>
                <div className='side-container'>
                    <h4 className='side-header'>회차</h4>
                    <div className='side-content'><button className='button select' type='button'>1회 20:00</button><button className='button no' type='button'>1회 20:00</button></div>
                    <p className='remain'>잔여석 70</p>
                    <button className='pay-button' onClick={openModal}>예매하기</button>
                    {modalOpen && <PayPopup plus={plusIndex} index={index} minus={minusIndex} open={openModal} close={closeModal} header={<PopupHeader index={index}/>} body={<PopupContent date={today} item_name={item_name} cancelday={cancelday} price={price} index={index} />}/>}
                </div>
            </Styleside>
        </div>
    );
}

export default TCalendar;