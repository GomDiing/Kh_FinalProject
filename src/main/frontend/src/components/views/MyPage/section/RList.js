import React, { useState } from 'react';
import { Table, Divider } from 'antd';
import styled from 'styled-components';
import ReserveDetailModal from '../section/ReserveDetailModal';
import { useNavigate } from 'react-router-dom';

// 컬럼명 맞춰서 API 문서 만들면 됨

const Style = styled.div`
  table, th, tr, td {
    border: 1px solid black;
  }
`;

const Body = () => (
  <Style>
    <div>
      <div>
          <table>
            <thead>
              <tr>
                <th>상품 이름</th>
                <th>상품 수량</th>
                <th>상품 총 가격</th>
                <th>결제 수단</th>
                <th>결제 상태</th>
                <th>결제 완료 시간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>안녕테스트</td>
                <td>안녕테스트</td>
                <td>안녕테스트</td>
                <td>안녕테스트</td>
                <td>안녕테스트</td>
                <td>안녕테스트</td>
              </tr>
            </tbody>
          </table>
        </div>
    </div>
  </Style>
);

const RList = () => {

  const [modalOpen, setModalOpen] = useState(false);
  const open = () => setModalOpen(true);
  const close = () => setModalOpen(false);
  const navigate = useNavigate();
  const cancelClick = () => navigate('/paycancel');

  const columns = [
    {
        title: '예매일',
        dataIndex: 'Rdate',
    },
    {
        title: '예매번호',
        dataIndex: 'Rnum',
    },
    {
        title: '공연명',
        dataIndex: 'name',
    },
    {
        title: '관람일',
        dataIndex: 'date',
    },
    {
        title: '매수',
        dataIndex: 'count',
    },
    {
        title: '상태',
        dataIndex: 'detail',
    },
];
const data = [
    {
        key: '1',
        Rdate: '2022.11.28',
        Rnum: 'T2200902901R1',
        name: '태양의서커스〈뉴 알레그리아〉',
        date: '2022.11.30',
        count: '1매',
        detail: <button onClick={open}>상세보기</button>
    },
    {
        key: '2',
        Rdate: '2022.11.28',
        Rnum: 'T2200922601R1',
        name: '마틸다',
        date: '2022.11.30',
        count: '1매',
        detail: <button onClick={open}>상세보기</button>
    },                                    
];

  return(
    <>
    {modalOpen && <ReserveDetailModal open={open} cancel={cancelClick} close={close} body={<Body />}/>}
    <Divider>예매 내역</Divider>
    <Table columns={columns} dataSource={data} size="middle" />
    </>
  );
};
export default RList;