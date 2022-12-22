import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { seatIndexAction } from "../../../../../util/Redux/Slice/seatIndexSlice";
import { PayReady } from "../../../../KakaoPay/PayReady";

const BodyStyle = styled.div`
  table ,tr {
    border: 1px solid black;
  }
  td {
    width: 230px;
    border-left: 1px solid silver;
    padding-right: 1rem;
    padding-left: 0.5rem;
  }
  th {
    width: 100px;
    padding-left: 1rem;
  }
  .seat-container .name {
    color: rebeccapurple;
  }
  .BorderBottom{
    border-bottom: 1px solid silver;
  }
  .select-box{
      display: flex;
      justify-content: center;
      width: 125px;
  }
  .BuyOption{
      opacity: 60%;
  }
  .kpay-button {
    background-color: white;
  }
  /* .sh {
    border-left: 1px solid black;
  } */
  
`;

function PopupContent (props) {
  const { title, seat, userInfo, seatIndex, date, turn, cancelday, index, hour, minute } = props;
  
    const [price, setPrice] = useState(0);
    const [value, setValue] = useState(0);
    const [type, setType] = useState('');
    const [stuValue, setStuValue] = useState(0);
    const [douValue, setDouValue] = useState(0);
    const [eveValue, setEveValue] = useState(0);
    // 좌석 선택한 인덱스
    const [seatNumber, setSeatNumber] = useState('');
    // 좌석 리스트
    const [seatList, setSeatList] = useState('');
    // 티켓 * 수량 = 총 티켓 금액
    const [ticket, setTicket] = useState(0);
    // 비과세 = 총 티켓 금액의 5%
    const [tax,setTax] = useState(0);
    // 총 결제금액(비과세 포함 금액)
    const [total, setTotal] = useState(0);
    // 학생 할인 티켓 금액
    const student = price - (price / 10);
    // 더블 할인 티켓 금액
    const double = price - (price / 20);
    // 신규 오픈 티켓 금액
    const openEvent = price - (price / 20);

    const [selectPrice, setSelectPrice] = useState(0);

    const dispatch = useDispatch();
    
    /**
     * Ticekt Discount !Duplicate Accept
     */
    const totalPayChange = (tickets, values, taxs, totals, price) => {
      // 선택한 종류의 가격 백에 보내기 위해 따로 저장
      setSelectPrice(price);
      tickets = values * price;
      setTicket(tickets);
      taxs = Math.floor(tickets / 20);
      setTax(taxs);
      totals = tickets + taxs;
      setTotal(totals);
    }
    const changeValue = e => {
      const name = e.target.name;
      let values,tickets, totals, taxs = 0;
      values = Number(e.target.value);
      switch(name) {
        case 'basic':
          setValue(values);
          setDouValue(0);
          setEveValue(0);
          setStuValue(0);
          setType('basic');
          totalPayChange(tickets, values, taxs, totals, price);
          break;
        case 'student':
          setStuValue(values);
          setValue(0);
          setDouValue(0);
          setEveValue(0);
          setType('student');
          totalPayChange(tickets, values, taxs, totals, student);
          break;
          case 'double':
            setDouValue(values);
            setValue(0);
            setEveValue(0);
            setStuValue(0);
            setType('double');
            totalPayChange(tickets, values, taxs, totals, double);
            break;
            case 'event':
              setEveValue(values);
              setValue(0);
              setDouValue(0);
              setStuValue(0);
              setType('event');
            totalPayChange(tickets, values, taxs, totals, openEvent);
          break;
        default:
          alert('오류');
      }
    }

    const valueSelect = () => {
      if(type === 'basic') {
        return value;
      } else if(type === 'student') {
        return stuValue;
      } else if(type === 'double') {
        return douValue;
      } else if(type === 'event') {
        return eveValue;
      }
    }

  const BodyReturn = () => (
    <>
    {index === 1 &&
    <div>
      <h2>좌석 선택 <p style={{fontSize : '14px'}}><strong>한번의 한 종류의 좌석만 선택 가능한 점 양해 부탁드립니다.</strong></p></h2>
      <div className='seat-container'>
        {seat && seat.map((seats, key) => (
          <table style={{border: 'none'}} key={key}>
            <thead>
              <tr>
                <th style={{border : 'none'}}
                >등급</th>
                <th style={{border : 'none'}}>가격</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{seats.seat}</td>
                <td>{seats.price}<input className={'check' + key} type='checkbox' onClick={e => {
                  // 선택한 좌석의 이름
                  setSeatList(seats.seat);
                  // 필터를 걸쳐 테스트를 통과한 것을 배열로 다시 만들어줌
                  const res = seatIndex.filter(test => test.seat.includes(seats.seat));
                  // 만들어진 배열에서 필요한 값을 추출..
                  setSeatNumber(res[0].index);
                  setPrice(seats.price);
                  console.log(seatNumber);
                  console.log(price)
                  // 리덕스에 값 저장
                  dispatch(seatIndexAction.setSeatInfo(res[0].index));
                  }}/>
                  </td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
        <hr />
        <MyInfo seat={seatList} hour={hour} turn={turn} point={userInfo.userPoint} minute={minute} index={index} price={price} title={title} date={date} cancelday={cancelday} />
    </div>
    }
    {index === 2 &&
    <>
    <div>
      <h2>가격</h2>
        <div>
          <strong>중복 할인 불가입니다. 하나의 유형으로만 선택해주세요.</strong>
        </div>
        <table>
          <tbody>
          <tr>
            <th className='BorderBottom'>기본가</th>
            <td className='BorderBottom'>일반</td>
            <td className='BorderBottom'>{price}</td>
            <td className='select-box'>
              <select name='basic' value={value} onChange={changeValue}>
                <option>{0}</option>
                <option>{1}</option>
                <option>{2}</option>
                <option>{3}</option>
                <option>{4}</option>
                <option>{5}</option>
              </select>
              <span>수량</span>
            </td>
          </tr>
          <tr>
            <th rowSpan={3}>기본 할인</th>
            <td>학생 할인(10%)</td>
            <td>{student}</td>
            <td className='select-box'>
              <select name='student' value={stuValue} onChange={changeValue}>
                <option>{0}</option>
                <option>{1}</option>
                <option>{2}</option>
                <option>{3}</option>
                <option>{4}</option>
                <option>{5}</option>
              </select>
              <span>수량</span>
            </td>
          </tr>
          <tr>
            <td>더블 할인(5%)</td>
            <td>{double}</td>
            <td className='select-box'>
              <select name='double' value={douValue} onChange={changeValue}>
                <option>{0}</option>
                <option>{1}</option>
                <option>{2}</option>
                <option>{3}</option>
                <option>{4}</option>
                <option>{5}</option>
              </select>
              <span>수량</span>
            </td>
          </tr>
          <tr>
            <td>신규오픈 할인(5%)</td>
            <td>{openEvent}</td>
            <td className='select-box'>
              <select name='event' value={eveValue} onChange={changeValue}>
                <option>{0}</option>
                <option>{1}</option>
                <option>{2}</option>
                <option>{3}</option>
                <option>{4}</option>
                <option>{5}</option>
              </select>
              <span>수량</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div className='BuyOption'>
        <li>장애인, 국가유공자 할인가격 예매 시 현장수령만 가능하며 증빙된서류 미지참시 할인 불가능합니다.</li>
        <li>관람일 전일 아래시간까지만 취소 가능하며 당일 관람 상품 예매 시에는 취소 불가능 합니다.</li>
        <p> - 공연전일 평일/일요일/공휴일 오후 5시, 토요일 오전 11시단,토요일 공휴일인 경우는 오전 11시</p>
        <p> - 당일관람 상품예매시는 취소불가능합니다.</p>
        <p> - 취소수수료와 취소가능일자는 상품별로 다르니, 오른쪽 하단 My예매정보를 확인해주시기 바랍니다.</p>
        <li>동일 상품에 대해서 회차, 좌석 가격, 결제 등 일부 변경을 원하시는 경우, 기존 예매 건을 취소하시고 재예매 하셔야 합니다.
        단, 취소 시점에 따라 예매수수료가 환불 되지 않으며, 취소 수수료가 부과될 수 있습니다.</li>
      </div>
      <MyInfo seat={seatList} hour={hour}turn={turn} point={userInfo.userPoint} minute={minute} cancelday={cancelday} title={title} date={date} value={value} ticket={ticket} tax={tax} total={total} />
      </>
      }
      {index === 3 && <FinalModal
        seatNumber={seatNumber} seat={seatList} cancelday={cancelday} 
        title={title} date={date} value={valueSelect()} ticket={ticket}
        price={selectPrice} tax={tax} total={total} userInfo={userInfo} 
        hour={hour} minute={minute}  turn={turn}/>}
      </>
  );

  return(
    <BodyStyle>
      <BodyReturn />
    </BodyStyle>
  );
}

  const FinalModal = props => {
    const { seatNumber, seat, cancelday, hour, minute, title, date, turn, value, ticket, tax, total, userInfo, price } = props;
    PayReady(title, total, tax, value, seatNumber, userInfo, price);
    const payUrl = window.localStorage.getItem('url');

    return(
      <div>
        <div>
          <MyInfo seat={seat} hour={hour} point={userInfo.userPoint} minute={minute} turn={turn} cancelday={cancelday}  title={title} date={date} value={value} ticket={ticket} tax={tax} total={total}/>
          <br/>
          {/* <Link to={'/payready'}>카카오페이 가자</Link> */}
          <a href={payUrl}><button type="button" className='kpay-button'><img src="/images/payment_icon_yellow_medium.png" alt=""/></button></a>
        </div>
    </div>
    );
  }

  const MyInfo = props => {
    
    const [open, setOpen] = useState(false);
    const onTogle = () => setOpen(!open);
    const { date, hour, point, minute, ticket, tax, total, price, index, seat, cancelday, turn } = props;
    return(
      <div>
        <h2>My예매정보</h2>
        <table>
          <tbody>
          <tr>
            <th>제목</th>
            <td>{props.title}</td>
            <th className="sh">일시/회차</th>
            <td>{date} / {turn}회차 {hour}시{minute}분</td>
          </tr>
          <tr>
            <th>선택 좌석</th>
            <td>{seat}</td>
            <th className="sh">티켓 금액</th>
            <td>{index === 1 ? price : ticket}</td>
          </tr>
          <tr>
            <th>비과세(5%)</th>
            <td>{tax}</td>
            <th className="sh">현재 포인트</th>
            <td>{point}<span><button type="button">포인트 사용하기</button></span></td>
          </tr>
          <tr>
            <th>취소 기한</th>
            <td>{cancelday}까지</td>
            <th className="sh">취소 수수료</th>
            <td>티켓 금액의 0 ~ 30% <small onClick={onTogle}><strong><u>상세 보기</u></strong></small>
              {open && <>
              <br /><small>공연 당일 하루 전까지는 수수료 없이 무료 환불이 가능합니다.</small>
              <br /><small>공연 당일 취소를 신청할 경우 환불 시 수수료가 10% 발생합니다.</small>
              </>}
            </td>
          </tr>
          <tr>
            <th>총 결제금액</th>
            <td>{index === 1 ? price : total}</td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
export default PopupContent;