import React, { useEffect, useState } from 'react';
import { Table, Divider } from 'antd';
import styled from 'styled-components';
import ReserveDetailModal from '../section/ReserveDetailModal';
import { useSelector } from 'react-redux';
import PayApi from '../../../../api/PayApi';

// 컬럼명 맞춰서 API 문서 만들면 됨

const Style = styled.div`
  table, th, tr, td {
    border: 1px solid black;
  }
`;

const Body = () => (
  <Style>
    <ul>
      <li>공연 당일 1주일 전까지는 수수료 없이 무료 환불이 가능합니다.</li>
      <li>공연 당일 3일 전에 취소를 신청할 경우 환불 시 수수료가 5% 발생합니다</li>
      <li>공연 당일 1일 전에 취소를 신청할 경우 환불 시 수수료가 10% 발생합니다</li>
      <li>공연 당일은 취소가 불가능합니다.</li>
    </ul>
  </Style>
);

const RList = () => {
  
  const userIndex = useSelector((state) => state.user.info.userIndex);
  const [selectList, setSelectList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [ticket, setTicket] = useState('');
  const open = () => {
    setModalOpen(true);
  }
  const close = () => setModalOpen(false);

  useEffect(() => {
    const paySelect = async () => {
      try {
        const res = await PayApi.paySelect(userIndex);
        if(res.data.statusCode === 200) {
          console.log(res.data);
          setSelectList(res.data.results);
        }
      } catch (e) {
        console.log(e);
        console.log('error!!');
      }
    }
    paySelect();
  }, [userIndex]);

  const columns = [
    {
        title: '예매일',
        dataIndex: 'reserve_time',
    },
    {
        title: '예매번호',
        dataIndex: 'reserve_ticket',
    },
    {
        title: '공연명',
        dataIndex: 'product_title',
    },
    {
        title: '관람일',
        dataIndex: 'view_time',
    },
    {
        title: '매수',
        dataIndex: 'count',
    },
    {
        title: '취소',
        dataIndex: 'reserve_ticket',
        render: (reserve_ticket) => (
          <button onClick={(() => {
            setModalOpen(true);
            // 기존 값을 맵 돌려서
            selectList && selectList.map(item => {
              // 선택한 티켓이랑 같은 것만 찾고
              if(item.reserve_ticket === reserve_ticket) {
                // 하나만 같고 나머지는 undifinded라 그거 다 걸러서 setTicket에 선택한 정보를 받음
                if(item !== undefined) {
                  setTicket(item);
                }
              }
              return item;
            });
            })}>취소</button>
        )
      }
    ];
    
  return(
    <>
    {modalOpen && <ReserveDetailModal open={open} ticket={ticket} close={close} body={<Body />}/>}
    <Divider>예매 내역</Divider>
    <Table columns={columns} dataSource={selectList} size="middle" />
    </>
  );
};
export default RList;