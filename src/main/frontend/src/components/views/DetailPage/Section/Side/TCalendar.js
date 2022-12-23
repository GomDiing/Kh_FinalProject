import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import './calendar.css';
import styled from 'styled-components';
import PayPopup from '../Popup/PayPopup';
import PopupHeader from '../Popup/PopupHeader';
import PopupContent from '../Popup/PopupContent';
import moment from 'moment';
import DetailApi from '../../../../../api/DetailApi';

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
    .react-calendar__navigation {
        button {
            &:disabled {
                background-color: white;
                color: black;
            }
        }
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
        font-weight: 750;
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
    const { dim, code, userInfo, title, seat , handleTop} = props;
    
    const [date, setDate] = useState(new Date());
    const [modalOpen, setModalOpen] = useState(false);
    const [index, setIndex] = useState(1);
    const plusIndex = () => setIndex(index+1);
    const minusIndex = () => setIndex(index-1);

    // 받아온 예약 가능한 날짜(dim)를 select에 담음
    const [select, setSelect] = useState([]);
    // 상품 코드
    const [pCode, setPcode] = useState(code);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    // 회차 리스트 정보
    const [reserveList, setReserveList] = useState([]);
    // 몇 회차인지
    const [turn, setTurn] = useState(0);
    // 시간 받기
    const [hour, setHour] = useState([]);
    const [minute, setMinute] = useState([]);
    // 캐스팅 유무
    const [isCasting, setIsCasting] = useState(false);
    const [isTimeCasting, setIsTimeCasting] = useState(false);

    // 선택한 날짜
    const selectDay = moment(date, 'YYYY-MM-DD')._d.toLocaleDateString();
    // 1일 전
    const cancelday = moment(date, 'YYYY-MM-DD').subtract(1, 'day')._d.toLocaleDateString();
    function parse(str) {
      var y = str.substr(0, 4);
      var m = str.substr(5, 2);
      var d = str.substr(8, 2);
      return new Date(y,m-1,d);
  }
    // 예매 가능한 첫 날짜
    const [firstDay, setFirstDay] = useState('');
    const openModal = e => {
      if(turn === 0) {
        alert('회차를 선택해주세요.');
        e.preventDefault();
      } else if(turn > 0) {
        handleTop();
        setModalOpen(true);
      }
    }
    const closeModal = () => {
        setModalOpen(false);
        setIndex(1);
        setTurn(0);
    }

    const onClickTurn = e => {
      const name = e.target.name;
      if(name === 'turn1') {
        setTurn(1);
      } else if(name === 'turn2') {
        setTurn(2);
      }
    }

    useEffect(() => {
      setSelect(dim);
      setPcode(code);
    }, [code, dim]);

    // 1번 딤이 스트링으로 들어옴 YYYY-MM-DD
    // 2번 셀렉트 변수에 예매 가능한 날짜의 배열을 복사
    useEffect(() => {
      try {
        const changeReserveMonth = async () => {
          const res = await DetailApi.getNextReserve(pCode, year, month);
          // 날짜가 바뀌면 값은 잘 찍힌다..
          if(res.data.statusCode === 200) {
            setSelect([...res.data.results.check_list.reserve_day_in_month]);
            // 캐스팅 정보가 있는지 받음
            setIsCasting(res.data.results.check_list.is_info_casting);
            // 조회한 달 내에 첫번 째 요소가 최초로 예매 가능 한 날
            setFirstDay(res.data.results.calendar_list[0].date);
            // 캐스팅 정보가 있을 경우 시간 캐스팅 정보 유무 확인
            isCasting && setIsTimeCasting(res.data.results.check_list.is_info_time_casting);
          } else {
            console.log('error');
            console.log(res);
          }
        }
        changeReserveMonth();
      } catch(e) {
        console.log(e);
      }
    }, [isCasting, month, pCode, year]);

    useEffect(() => {
      try {
        const chagneReserveDay = async () => {
          const res = await DetailApi.getNextDateReserve(pCode, year, month, date.getDate());
          if(res.data.statusCode === 200) {
            let response = res.data.results.reserve_list
            // 회차 리스트
            setReserveList(response);
            setHour(response.map((cd) => cd.hour));
            setMinute(response.map((cd) => cd.minute));
          } else {
            console.log('error');
            console.log(res);
          }
        }
        chagneReserveDay();
      } catch(e) {
        console.log(e);
      }
    }, [date, month, pCode, year]);

    const clickDay = () => {
      setTurn(0);
    };

    return (
        <SideWrap>
            <h3 className='text-center' style={{fontSize : '21px' , fontWeight : 'bolder' , margin: '15px 0'}}>관람일</h3>
            <div className='calendar-container'>
            <Calendar onChange={setDate} value={date}
            formatDay={(locale, date) => moment(date).format("DD")}
            goToRangeStartOnSelect={false}
            showNeighboringMonth={false}
            next2Label={null}
            prev2Label={null}
            minDetail={month}
            onClickDay={clickDay}
            activeStartDate={parse(firstDay)}
            onActiveStartDateChange={({ action, activeStartDate, view }) => {
              setYear(activeStartDate.getFullYear());
              setMonth(activeStartDate.getMonth() + 1);
            }}
            tileDisabled={({activeStartDate, date, view}) => {
              if (!select.find((x) => moment(x).format('YYYY-MM-DD') === moment(date).format("YYYY-MM-DD"))) {
                return date.getDate();
              }
            }}
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
              {/* 1회차 정보. */}
              {/* 기본으로 1회차 정보 보여주고 1회차 클릭 1회차 정보 2회차 클릭 2회차 정보 나오게 둘다 나오면 너무 커지기 때문 이거 내일 오전에 수정 */}
              {/* 낼 포인트 로직, 취소 로직, 오늘 수정한 것 다시 팝업에 정보 잘 넘어가는지 확인, 포인트 되면 캐시백 로직, 체크박스 수정 */}
              {/* 1번 모달 수정 가격표 수정  */}
              {reserveList && reserveList.map(reserve => {
                return(
                  reserve.turn === 1 &&
                  <div key={reserve.index}>
                    <div>
                      <button className='button select' onClick={onClickTurn} name='turn1' type='button'>
                        {reserve.turn}회 {reserve.hour}:{reserve.minute === 0 ? '00' : reserve.minute}
                      </button>
                    </div>
                    {reserve.reserve_seat_time && reserve.reserve_seat_time.map(seat => {
                      return(
                        <div style={{display: 'inline'}} key={seat.index}>
                          {seat.is_reserve && <span>{seat.seat} {seat.remain_quantity} / </span>}
                        </div>
                      );
                    })}
                    <h4 className='side-header'>캐스팅</h4>
                    {/* 캐스팅 정보, 시간 별로 캐스팅 정보가 있으면 보임 없으면 x */}
                    {isCasting && isTimeCasting && reserve.compact_casting ?
                      reserve.compact_casting.map((cast, id) => {
                        return(
                        <>
                          <div style={{display: 'inline'}} key={id} >
                          <span>{cast}, </span>
                          </div>
                        </>
                        );
                    })
                    :
                    <small>해당 상품은 캐스팅 정보가 없습니다.</small>
                    }
                  </div>
                );
              })}
              {/* 2회차 정보. */}
              {reserveList && reserveList.map(reserve => {
                return(
                  reserve.turn === 2 &&
                  <div key={reserve.index}>
                    <div>
                      <button className='button select' onClick={onClickTurn} name='turn2' type='button'>
                        {reserve.turn}회 {reserve.hour}:{reserve.minute === 0 ? '00' : reserve.minute}
                      </button>
                    </div>
                    {reserve.reserve_seat_time && reserve.reserve_seat_time.map(seat => {
                      return(
                        <div style={{display: 'inline'}} key={seat.index}>
                          {seat.is_reserve && <span>{seat.seat} {seat.remain_quantity} / </span>}
                        </div>
                      );
                    })}
                    {/* 캐스팅 정보, 시간 별로 캐스팅 정보가 있으면 보임 없으면 x */}
                    <h4 className='side-header'>캐스팅</h4>
                    {isCasting && isTimeCasting && reserve.compact_casting ?
                    reserve.compact_casting.map((cast, id) => {
                      return(
                      <>
                        <div style={{display: 'inline'}} key={id} >
                        <span>{cast}, </span>
                        </div>
                      </>
                      );
                  })
                  :
                    <small>해당 상품은 캐스팅 정보가 없습니다.</small>
                  }
                  </div>
                );
              })}
              </div>
              {/* 회차에 따라 넘겨주는 정보가 다르기 때문임 회차 선택 시 가능 */}
              {turn === 0 ? <button className='pay-button' type='button' onClick={openModal}>예매하기</button>
              :
              <button className='pay-button' type='button' onClick={openModal}>예매하기</button>
              }
              {modalOpen && <PayPopup 
              plus={plusIndex} index={index} minus={minusIndex}
              open={openModal} close={closeModal}
              // Header
              header={<PopupHeader index={index}/>}
              // Body
              body={<PopupContent userInfo={userInfo}
              date={selectDay} cancelday={cancelday}
              // 1회차 2회차 좌석 인덱스가 달라서 구분
              seat={seat} seatIndex={turn === 1 ? reserveList[0].reserve_seat_time : reserveList[1].reserve_seat_time}
              hour={turn === 1 ? hour[0] : hour[1]}
              minute={turn === 1 ? minute[0] === 0 ? '00' : minute[0] : minute[1] === 0 ? '00' : minute[1]}
              turn={turn === 1 ? reserveList[0].turn : reserveList[1].turn}
              title={title} index={index} />}/>}
            </div>
            </Styleside>
        </SideWrap>
    );
}

export default TCalendar;