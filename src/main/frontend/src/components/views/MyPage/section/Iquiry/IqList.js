import React from 'react';
import { useState,useEffect } from "react";
import styled from "styled-components";
import { Table, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import MemberApi from '../../../../../api/MemberApi';
import IqModal from '../../../../views/MyPage/section/Iquiry/IqModal'

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



function IqList() {
  //  리액트 페이지네이션 변수 
  const [qnaList, setQnaList] = useState([]); //db 에서 정보 받아오기(배열에  담기)
  const [pageSize, setPageSize] = useState(7); // 한페이지에 몇개씩 있을건지
  const [totalCount, setTotalCount] = useState(0); // 총 데이터 숫자
  const [currentPage, setCurrentPage] = useState(1); // 현재 몇번째 페이지인지

  const [index, setIndex] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const open = () => setModalOpen(true);
  const close = () => setModalOpen(false);
  const navigate = useNavigate();
  const cancelClick = () => navigate('/paycancel');

  const columns = [
    {
        title: '사용자',
        dataIndex: 'id',
    },
    {
      title: '문의유형',
      dataIndex: 'category',
    },
    {
        title: '문의내용',
        dataIndex: 'content',
    },
    {
        title: '관람일',
        dataIndex: 'createTime',
    },
    {
        title: '상태',
        dataIndex: 'qnaStatus',
    },
    {
        title: '상태',
        dataIndex: 'modal',
        key: 'modal',
        render: () => <button onClick={()=>{setModalOpen(true)}}>답장</button>
    }
];
// const data = [
//     {
//         key: '1',
//         Rdate: '2022.11.28',
//         Rnum: 'T2200902901R1',
//         name: '태양의서커스〈뉴 알레그리아〉',
//         date: '2022.11.30',
//         count: '1매',
//         detail: <button onClick={open}>상세보기</button>
//     },                                  
// ];
  /** 공지 목록을 가져오는 useEffect */
  useEffect(() => {
    const noticeData = async()=> {
      try {
        const response = await MemberApi.myQnalist(currentPage, pageSize);
          setQnaList([...qnaList, ...response.data.qnaDTOList]);
          console.log(response.data.qnaDTOList[0].index);
          setIndex(response.data.qnaDTOList[0].index);
          // 페이징 시작
          setTotalCount(response.data.totalResults); 
          // db에서 잘라준 size 별로 잘랐을때 나온 페이지 수
          setCurrentPage(response.data.page);
    }catch (e) {
        console.log(e);
      }
    };
    noticeData();
  }, [currentPage]); // currentpage 값이 바뀌면 렌더링 되도록 
console.log(qnaList);
  return(
    <>
    {modalOpen && <IqModal open={open} cancel={cancelClick} close={close} index={index}/>}
    <Divider>문의 내역</Divider>
    <Table columns={columns} dataSource={qnaList} size="middle" pagination={currentPage} />
    </>
  );
}

export default IqList;

const MypageQnaBlock = styled.div`
    margin:0 auto;
    box-sizing: border-box;
  .container {
    width: 100%;
    margin : 10px;
    display: flex;
    border: 1px solid black;
    height: 60%;
    flex-direction: column;
    text-align: center;
    padding: 3rem;
  }
  .qnalist-table{
    width: 100%;
  }
table,th,td {
  border: 1px solid black;
  text-align: center;
}
tr{
    height: 35px;
}

`;
const Style = styled.div`
  table, th, tr, td {
    border: 1px solid black;
  }
`;

