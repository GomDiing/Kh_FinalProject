import React, { useEffect, useState } from 'react';
import { Table, Divider } from 'antd';
import styled from 'styled-components';
import ReserveDetailModal from '../section/ReserveDetailModal';
import { useNavigate } from 'react-router-dom';
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
  
  const userIndex = useSelector((state) => state.user.info.userIndex);
  const [selectList, setSelectList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const open = () => setModalOpen(true);
  const close = () => setModalOpen(false);
  const navigate = useNavigate();
  const cancelClick = () => navigate('/paycancel');

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

  console.log(selectList);
  
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
        render: () => (
          <button onClick={open}>취소</button>
        )
    },
];

  return(
    <>
    {modalOpen && <ReserveDetailModal open={open} cancel={cancelClick} close={close} body={<Body />}/>}
    <Divider>예매 내역</Divider>
    <Table columns={columns} dataSource={selectList} size="middle" />
    </>
  );
};
export default RList;