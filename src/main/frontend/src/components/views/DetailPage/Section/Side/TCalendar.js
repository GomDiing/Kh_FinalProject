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
    button {
      a {
          color: black;
          text-decoration: none;
      }
    }
    .react-calendar__navigation {
        button {
            &:disabled {
                background-color: white;
                color: black;
              }
            }
          }
    .text-center2 {
        display : flex;
        align-items: center;
        justify-content: center;
        margin: 7px;
      }
      hr{
        margin: 0;
      }
      `
const Styleside = styled.div`
      
    .side-header{
      text-align: center;
        font-size: 14px;
        font-weight:  bold;
    }

    .side-content {
        padding: 0 1.5rem;
        text-align: center;
      }
    .CalenderInfo{
        font-size: 13px;
        opacity: 60%;
    }
    .button {
        border: 1px solid #EF3F43;
        border-top-right-radius: 0.6rem;
        border-bottom-right-radius: 0.6rem;
        border-top-left-radius: 0.6rem;
        border-bottom-left-radius: 0.6rem;
        width: 140px;
        height: 35px  ;
        background-color: white;
        margin-left: 0.15rem;
        margin-right: 0.15rem;
        font-size: large;
        font-weight: bold;
    }
    .button-disabled {
      border: 1px solid #EF3F43;
      border-top-right-radius: 0.6rem;
      border-bottom-right-radius: 0.6rem;
      border-top-left-radius: 0.6rem;
      border-bottom-left-radius: 0.6rem;
      width: 140px;
      height: 35px;
      background-color: white;
      color: silver;
      margin-left: 0.15rem;
      margin-right: 0.15rem;
      font-size: large;
      font-weight: bold;
      pointer-events: none;
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
    p{
      font-weight: bold;
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
    const [isNext, setIsNext] = useState(false);
    const handleIsNextClick = () => setIsNext(true);
    const handleisBackClick = () => setIsNext(false);
    const plusIndex = () => {
      if(isNext) {
        setIndex(index+1);
        setIsNext(false);
      } else {
        alert('좌석 또는 수량을 선택해주세요.');
      }
    }
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
        if(userInfo.userEmail === undefined && userInfo.userId === undefined) {
          alert('로그인이 필요한 페이지입니다.');
          e.preventDefault();
        } else {
          handleTop();
          setModalOpen(true);
        }
      }
    }
    const closeModal = () => {
        setModalOpen(false);
        setIndex(1);
        setTurn(0);
        setIsNext(false);
    }

    useEffect(() => {
      setSelect(dim);
      setPcode(code);
    }, [code, dim]);

    // 당일 공연 막기
    // 22.12.26 0100 > 22.12.26.0010 true 나오면 끝
    // 22.12.26 0110 > 22.12.26 0105 true 나오면 끝
    const isDateSameReserveDate = (date1, date2, hour, minute) => {
      // 년 월 일이 같을 때 현재 시간이 공연 시간보다 더 크면 트루 disabled 아니면 false
      if(date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate() ) {
        // 시간이 크면 무조건 트루 왜냐 공연이 4시인데 현재 시간은 5시 6시면 예매 X
        if(date1.getHours() > hour) {
          return true;
        } else if (date1.getHours() === hour) {
          return date1.getMinutes() > minute && true;
        }
          // 현재 시간이 같을 경우 분이 다를 수 있기 때문 분도 계산
        }
      }

      const onClickTurn = e => {
        const name = e.target.name;
        if(name === 'turn1') {
          console.log(e.target.className);
          setTurn(1);
        } else if(name === 'turn2') {
          setTurn(2);
        }
      }

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
            console.log(res);
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
            <h3 className='text-center' style={{fontSize : '19px' , fontWeight : 'bolder' , margin: '10px 0'}}>관람일</h3>
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
            <div className='text-center2'>
            {/* <br/> */}
            <span className='bold'>선택한 날짜 : </span>{' '}
            <strong className='select-date'>{date.toLocaleString("kr", {month:"short", day: "numeric"})}</strong>
            </div>
            <hr />
            <Styleside>
            <div className='side-container'>
              <h4 className='side-header'style={{marginTop : '5px'}}>회차</h4>
              <div className='side-content'>
              {/* 1회차 정보. */}
              {/* 모든 회차 리스트를 돌립니다 turn ===1 1회차 turn === 2회차 */}
              {reserveList && reserveList.map(reserve => {
                return(
                  // 회차 정보
                  reserve.turn === 1 &&
                  <div key={reserve.index}>
                    <div>
                      {/* 당일 공연인데 시간 지나도 선택할 수 있어서 막아놈 년월일 같다는 기준에 공연 19:30 현재 시간 20:30인데 선택 가능함 그래서 그거 막았음. */}
                      <button className={isDateSameReserveDate(new Date(), date, reserve.hour, reserve.minute) ? 'button-disabled' : 'button select'} onClick={onClickTurn} name='turn1' type='button'>
                        {/* 1회차 1회 시간 분은 0분으로 나오면 19:0분 이여서 0이면 19:00으로 바꿔주기 위해 */}
                        {reserve.turn}회 {reserve.hour}:{reserve.minute === 0 ? '00' : reserve.minute}
                      </button>
                    </div>
                    {/* 1회차에 맞는 좌석 정보가 있으면 맵 */}
                    {reserve.reserve_seat_time && reserve.reserve_seat_time.map(seat => {
                      return(
                        <div style={{display: 'inline'}} key={seat.index} className = "CalenderInfo">
                          {seat.is_reserve && <span>{seat.seat} {seat.remain_quantity} / </span>}
                        </div>
                      );
                    })}
                    <h4 className='side-header'>캐스팅</h4>
                    {/* 1회차 캐스팅 정보, 시간 별로 캐스팅 정보가 있으면 보임 없으면 x */}
                    {isCasting && isTimeCasting && reserve.compact_casting ?
                      reserve.compact_casting.map((cast, id) => {
                        return(
                        <>
                          <div style={{display: 'inline'}} key={id} className = "CalenderInfo">
                          <span>{cast}, </span>
                          </div>
                        </>
                        );
                    })
                    :
                    <p>해당 상품은 캐스팅 정보가 없습니다.</p>
                    }
                  </div>
                );
              })}
              {/* 2회차 정보. 1회차랑 동일 */}
              {reserveList && reserveList.map(reserve => {
                return(
                  reserve.turn === 2 &&
                  <div key={reserve.index}>
                    <div>
                      <button className={isDateSameReserveDate(new Date(), date, reserve.hour, reserve.minute) ? 'button-disabled' : 'button select'} onClick={onClickTurn} name='turn2' type='button'>
                        {reserve.turn}회 {reserve.hour}:{reserve.minute === 0 ? '00' : reserve.minute}
                      </button>
                    </div>
                    {reserve.reserve_seat_time && reserve.reserve_seat_time.map(seat => {
                      return(
                        <div style={{display: 'inline'}} key={seat.index} className = "CalenderInfo">
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
                        <div style={{display: 'inline'}} key={id} className = "CalenderInfo">
                        <span>{cast}, </span>
                        </div>
                      </>
                      );
                  })
                  :
                    <p>해당 상품은 캐스팅 정보가 없습니다.</p>
                  }
                  </div>
                );
              })}
              </div>
              {/* 회차에 따라 넘겨주는 이거는 뭐였는지 기억안남 추후 다시 보겠습니다. 정보가 다르기 때문임 회차 선택 시 가능 */}
              {turn === 0 ? <button className='pay-button' type='button' onClick={openModal}>예매하기</button>
              :
              <button className='pay-button' type='button' onClick={openModal}>예매하기</button>
              }
              {/* 예매하기 모달로 이동 */}
              {modalOpen && <PayPopup 
              plus={plusIndex} index={index} minus={minusIndex}
              open={openModal} close={closeModal} test={isNext}
              // Header
              header={<PopupHeader index={index}/>}
              // Body
              body={<PopupContent userInfo={userInfo}
              date={selectDay} cancelday={cancelday}
              // 1회차 2회차 좌석 인덱스가 달라서 구분
              // 모달에 넘겨줄 때 1회차면 1회차 정보를 보내줘야 해서 다 조건부로 그냥 처리 더 쉽게 할 수 있을텐데 많이 아쉽지만 시간이 없기에 일단 하드코딩..
              seat={seat} seatIndex={turn === 1 ? reserveList[0].reserve_seat_time : reserveList[1].reserve_seat_time}
              hour={turn === 1 ? hour[0] : hour[1]}
              minute={turn === 1 ? minute[0] === 0 ? '00' : minute[0] : minute[1] === 0 ? '00' : minute[1]}
              turn={turn === 1 ? reserveList[0].turn : reserveList[1].turn}
              title={title} index={index} 
              nextClick={handleIsNextClick} backClick={handleisBackClick}
              />}
              />}
            </div>
            </Styleside>
        </SideWrap>
    );
}

export default TCalendar;