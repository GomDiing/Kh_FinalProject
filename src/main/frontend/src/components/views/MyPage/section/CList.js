import React from 'react';
import { Table, Divider } from 'antd';

// 취소내역
// 컬럼명 맞춰서 API 문서 만들면 됨
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
        title: '상태',
        dataIndex: 'reserve_status',
    },
];
const data = [
    {
        key: '1',
        Rdate: '2022.11.28',
        Rnum: 'TL0000021011',
        name: '뮤지컬<영웅>',
        date: '2022.12.21',
        count: '1매',
        detail: <button>상세보기</button>
    },             
    {
        key: '2',
        Rdate: '2022.11.28',
        Rnum: 'T2201458601R2',
        name: '뮤지컬 〈물랑루즈〉',
        date: '2022.12.24',
        count: '2매',
        detail: <button>상세보기</button>
    },                       
];
const CList = () => (
    <>
    <Divider>취소 내역</Divider>
    <Table columns={columns} dataSource={data} size="middle" />
    </>
);
export default CList;