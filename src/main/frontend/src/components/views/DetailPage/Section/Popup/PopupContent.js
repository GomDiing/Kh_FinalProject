import React, { useState } from "react";
import styled from "styled-components";
import { PayReady } from "../../../../KakaoPay/PayReady";

const BodyStyle = styled.div`
  table ,tr {
    border: 1px solid black;
  }
  td{
      width: 200px;
    border-left: 1px solid silver;
  }
  th{
    width: 100px;
  }
  .seat-container {
    border: 1px solid black;  
    width: 400px;
    margin-top: 10px;
  }
  li{
    display: inline-block;
    margin-top: 10px;
  }
  .price-info {
    float: right;
    margin-right: 150px;        
    margin-top: 10px; 
  }
  .seat {
    float: left;
    margin-right: 30px;
    width: 20px;
    height: 20px;
    margin-top: 10px;
  }
  .seat-vip {
    background-color: red;
  }
  .seat-r {
    background-color: green;
  }
  .seat-s {
    background-color: royalblue;
  }
  .seat-a {
    background-color: aliceblue;
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
`;

function PopupContent (props) {
  const { item_name, price, date, cancelday, index } = props;
  
    const [value, setValue] = useState(0);
    const [stuValue, setStuValue] = useState(0);
    const [douValue, setDouValue] = useState(0);
    const [eveValue, setEveValue] = useState(0);
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
    /**
     * 
     * Ticekt Quantity !Duplicate Accept
     */
    const changeValue = e => {
      const name = e.target.name;
      let values,tickets, totals, taxs = 0;
      values = Number(e.target.value);
      if(name === 'basic') {
          setValue(values);
          setDouValue(0);
          setEveValue(0);
          setStuValue(0);
          tickets = values * price;
          setTicket(tickets);
          taxs = Math.floor(tickets / 20);
          setTax(taxs);
          totals = tickets + taxs;
          setTotal(totals);
        } else if(name === 'student') {
          setStuValue(values);
          setValue(0);
          setDouValue(0);
          setEveValue(0);
          tickets = values * student;
          setTicket(tickets);
          taxs = Math.floor(tickets / 20);
          setTax(taxs);
          totals = tickets + taxs;
          setTotal(totals);
        } else if(name === 'double') {
          setDouValue(values);
          setValue(0);
          setEveValue(0);
          setStuValue(0);
          tickets = values * double;    
          setTicket(tickets);
          taxs = Math.floor(tickets / 20);
          setTax(taxs);
          totals = tickets + taxs;
          setTotal(totals);
        } else if(name === 'event') {
          setEveValue(values);
          setValue(0);
          setDouValue(0);
          setStuValue(0);
          tickets = values * openEvent;
          setTicket(tickets);
          taxs = Math.floor(tickets / 20);
          setTax(taxs);
          totals = tickets + taxs;
          setTotal(totals);
        }
      }

  const BodyReturn = () => (
    <>
    {index === 1 &&
    <div>
      <h2>좌석 선택</h2>
      <div className='seat-container'>
        <ul>
          <span className='seat seat-vip'/>
            <li>VIP석 0석</li>
          <span className='price-info'>{price}원</span>
            <br />
          <span className='seat seat-r'/>
            <li>R석 5석</li>
          <span className='price-info'>{price}원</span>
            <br />
          <span className='seat seat-s'/>
            <li>S석 28석</li>
          <span className='price-info'>{price}원</span>
            <br />
          <span className='seat seat-a'/>
            <li>A석 94석</li>
          <span className='price-info'>{price}원</span>
            <br />
        </ul>
      </div>
        <hr />
        <MyInfo item_name={item_name} date={date} cancelday={cancelday} />
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
      <MyInfo cancelday={cancelday} item_name={item_name} date={date} value={value} ticket={ticket} tax={tax} total={total} />
      </>
    }
    {index === 3 && <FinalModal cancelday={cancelday} item_name={item_name} date={date} value={value} ticket={ticket} tax={tax} total={total} />}
    </>
  );

  return(
    <BodyStyle>
      <BodyReturn />
    </BodyStyle>
  );
}

  const FinalModal = props => {
    const { cancelday, item_name, date, value, ticket, tax, total } = props;
    PayReady(item_name, total, tax, value);
    const payUrl = window.localStorage.getItem('url');
    console.log(total, value, tax);

    
    return(
      <div>
      <div>
          <MyInfo cancelday={cancelday} item_name={item_name} date={date} value={value} ticket={ticket} tax={tax} total={total} />
          <br/>
          <a href={payUrl}><button className='kpay-button'><img src="/images/payment_icon_yellow_medium.png" alt=""/></button></a>
      </div>
    </div>
    );
  }

  const MyInfo = props => {
    
    const { item_name, date, ticket, tax, total,  cancelday } = props;
    return(
      <div>
        <h2>My예매정보</h2>
        <table>
          <tbody>
          <tr>
            <th>제목</th>
            <td>{item_name}</td>
            <th>일시</th>
            <td>{date}</td>
          </tr>
          <tr>
            <th>선택 좌석</th>
            <td>현 좌석</td>
            <th>티켓 금액</th>
            <td>{ticket}</td>
          </tr>
          <tr>
            <th>비과세(5%)</th>
            <td>{tax}</td>
            <th>현재 포인트</th>
            <td>230 <span><button>포인트 사용하기</button></span></td>
          </tr>
          <tr>
            <th>취소 기한</th>
            <td>{cancelday}까지</td>
            <th>취소 수수료</th>
            <td>티켓금액의 0~30%</td>
          </tr>
          <tr>
            <th>총 결제금액</th>
            <td>{total}</td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
export default PopupContent;