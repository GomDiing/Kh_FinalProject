import React from 'react';
import { useState,useEffect } from "react";
import styled from "styled-components";
import { Table, Divider,Pagination} from 'antd';
import { useNavigate } from 'react-router-dom';
import MemberApi from '../../../../../api/MemberApi';
import IqModal from '../../../../views/MyPage/section/Iquiry/IqModal'



function IqList() {
  //  리액트 페이지네이션 변수 
  const [qnaList, setQnaList] = useState([]); //db 에서 정보 받아오기(배열에  담기)
  const [pageSize, setPageSize] = useState(5); // 한페이지에 몇개씩 있을건지
  const [totalCount, setTotalCount] = useState(0); // 총 데이터 숫자
  const [currentPage, setCurrentPage] = useState(1); // 현재 몇번째 페이지인지

  const [modalText, setModalText] = useState('');


  const [index, setIndex] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const open = () => setModalOpen(true);
  const close = () => setModalOpen(false);
  const navigate = useNavigate();

  const columns = [
    {
      title: '문의유형',
      dataIndex: 'category',
    },
    {
        title: '문의내용',
        dataIndex: 'content',
    },
    {
        title: '문의 날짜',
        dataIndex: 'createTime',
    },
    {
        title: '상태',
        dataIndex: 'qnaStatus',
    },
    {
        title: '답장',
        dataIndex: 'modal',
        key: 'modal',
        render: () => <button onClick={()=>{setModalOpen(true)}}>답장</button>
    }
];

  /** qna 목록을 가져오는 useEffect */
  useEffect(() => {
    const qnaData = async()=> {
      try {
        const res = await MemberApi.myQnalist(currentPage, pageSize);
        if(res.data.statusCode === 200){
          setQnaList([...qnaList, ...res.data.results.qnaDTOList]);
          console.log(res.data.results.qnaDTOList[0].index);
          setIndex(res.data.qnaDTOList[0].index);
          // 페이징 시작
          setTotalCount(res.data.results.totalResults); 
          // db에서 잘라준 size 별로 잘랐을때 나온 페이지 수
          setCurrentPage(res.data.results.page);
        }
    }catch (e) {
        console.log(e);
      }
    };
    qnaData();
  }, [currentPage]); // currentpage 값이 바뀌면 렌더링 되도록 
console.log(qnaList);
  return(
    <>
    <Divider>문의 내역</Divider>
    {modalOpen && <IqModal open={open} close={close} index={index}/>}
    <Table columns={columns} dataSource={qnaList} size="middle"/>
    <Pagination className="d-flex justify-content-center"
    total={totalCount}  //총 데이터 갯수
    current={currentPage} 
    pageSize={pageSize}
    onChange={(page) => {setCurrentPage(page); setQnaList([]);}} //숫자 누르면 해당 페이지로 이동
   />
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

