import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import './calendar.css';
import styled from 'styled-components';
import PayPopup from '../Popup/PayPopup';
import PopupHeader from '../Popup/PopupHeader';
import PopupContent from '../Popup/PopupContent';
import moment from 'moment';

const SideWrap = styled.div`
    .select-date {
        color: #006edc;
        font-size: medium;
    }
    // a태그 속성제거 (모바일)
    a {
        color: black;
        text-decoration: none;
    }
`
const Styleside = styled.div`
    .side-header{
        text-align: center;
        font-size: 14px;
    }

    .side-content {
        padding: 0 1.5rem;
        text-align: center;
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
 * Detail에서 props로 전달 받기 
 */
function TCalendar (props) {
    const {cast, reserve, dim, code, userInfo, title, seat, dateList } = props;

    // 받아온 예약 가능한 날짜(dim)를 select에 담음
    const [select, setSelect] = useState(dim);

    useEffect(() => {
        setSelect(dim);
    }, [dim])

    const test = () => {
        alert("asd");
    }

    // str -> date type convert
    const parseDate = (dateList) => {
        let y = dateList.substr(0,4);
        let m = dateList.substr(5,2);
        let d = dateList.substr(8,2);
        return new Date(y,m-1,d);
    }

    // 첫 예매 가능한 날짜
    const first_reserve_day = parseDate(dateList.date);
    // 회차 정보 0이면 상시 상품
    const reserve_turn = dateList.reserve_list[0].turn;
    // 첫 회차별 예매 상세 정보 2회차가 있으면 1도 있을 듯 나중에 2회차도 하려면 로직 짜야함.
    const detail_info = dateList.reserve_list[0];
    // 첫 회차별 예매 시간
    const info_hour = detail_info.hour;
    // 첫 회차별 예매 분
    const info_minute = detail_info.minute;
    // 좌석 리스트
    const seatList = detail_info.reserve_seat_time;
    // 캐스팅 리스트
    const castingList = detail_info.compact_casting;

    const [date, setDate] = useState(new Date());
    const [modalOpen, setModalOpen] = useState(false);
    const [index, setIndex] = useState(1);
    const plusIndex = () => setIndex(index+1);
    const minusIndex = () => setIndex(index-1);

    
    const selectDay = moment(date, 'YYYY-MM-DD')._d.toLocaleDateString();
    // 1일 전
    const cancelday = moment(date, 'YYYY-MM-DD').subtract(1, 'day')._d.toLocaleDateString() + ' 공연 시작 1시간 전';
    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        setModalOpen(false);
        setIndex(1);
    }

    return (
        <SideWrap>
            <h3 className='text-center' style={{margin: '1.5rem 0'}}>관람일</h3>
            <div className='calendar-container'>
            <Calendar onChange={setDate} value={date}
            formatDay={(locale, date) => moment(date).format("DD")}
            // showNeighboringMonth={false}
            next2Label={null}
            prev2Label={null}
            onClickMonth={test}
            minDetail='year'
            

            // 예매 가능한 첫 날짜 집어넣음
            // activeStartDate={first_reserve_day}
            // minDate={first_reserve_day}
            tileDisabled={({date}) => {
                if (!select.find((x) => moment(x).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"))) {
                return true;
            }}}
            />
            </div>
            <div className='text-center'>
            <br/>
            <span className='bold'>선택한 날짜 : </span>{' '}
            <strong className='select-date'>{date.toLocaleString("kr", {month:"short", day: "numeric"})}</strong>
            <hr />
            </div>
            <Styleside>
                <div className='side-container'>
                    <h4 className='side-header'>회차</h4>
                    <div className='side-content'>
                      {/* 1회차 정보 상시 상품은 안보임. */}
                    {reserve_turn === 1 &&
                    <>
                    <div>
                        <button className='button select' type='button'>{reserve_turn}회 {info_hour}:{info_minute}</button>
                    </div>
                    {seatList && seatList.map(seat => {
                        return(
                        <>
                            <div style={{display : 'inline'}} key={seat.index}>
                            <span>{seat.seat} {seat.remain_quantity} / </span>
                            </div>
                        </>
                        );
                    })}
                    <hr />
                    <h4 className='side-header'>캐스팅</h4>
                    {cast && castingList && castingList.map((cast) => {
                        return(
                        <>
                            <div style={{display: 'inline'}} >
                            <span>{cast}, </span>
                            </div>
                        </>
                        );
                    })}
                    {!cast && <div>캐스팅 정보가 없습니다.</div>}
                    </>
                    }
                    {/* 2회차 정보가 들어오면 할 예정 */}
                    {reserve_turn === 2 &&
                    <button className='button no' type='button'>2회 20:00</button>
                    }
                        </div>
                        <p />
                    <button className='pay-button' onClick={openModal}>예매하기</button>
                    {modalOpen && <PayPopup 
                    plus={plusIndex} index={index} minus={minusIndex} open={openModal} close={closeModal}
                    header={<PopupHeader index={index}/>}
                    body={<PopupContent userInfo={userInfo} date={selectDay} cancelday={cancelday} 
                    seat={seat} seatIndexList={seatList} title={title} index={index} />}/>}
                </div>
            </Styleside>
        </SideWrap>
    );
}

export default TCalendar;