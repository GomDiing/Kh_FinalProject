import React, { useEffect, useState } from 'react';
import { Table, Divider } from 'antd';
import { useSelector } from 'react-redux';
import PayApi from '../../../../api/PayApi';

// 컬럼명 맞춰서 API 문서 만들면 됨

const CList = () => {
  
  const userIndex = useSelector((state) => state.user.info.userIndex);
  const [cancelList, setCancelList] = useState([]);

  useEffect(() => {
    const payCancelSelect = async () => {
      try {
        const res = await PayApi.payCancelSelect(userIndex);
        if(res.data.statusCode === 200) {
          console.log(res.data);
          setCancelList(res.data.results);
        }
      } catch (e) {
        console.log(e);
        console.log('error!!');
      }
    }
    payCancelSelect();
  }, [userIndex]);

  const columns = [
    {
        title: '취소 일자',
        dataIndex: 'reserveTime',
    },
    {
        title: '예매번호',
        dataIndex: 'reserveTicket',
    },
    {
        title: '공연명',
        dataIndex: 'productTitle',
    },
    {
        title: '관람일',
        dataIndex: 'viewTime',
    },
    {
        title: '매수',
        dataIndex: 'count',
    },
    {
        title: '예매 상태',
        dataIndex: 'reserveStatus',
    }
    ];
    
  return(
    <>
    <Divider>취소 내역</Divider>
    <Table columns={columns} dataSource={cancelList} size="middle" />
    </>
  );
};
export default CList;