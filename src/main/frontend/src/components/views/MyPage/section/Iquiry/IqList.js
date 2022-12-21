import React from 'react';
import { useState,useEffect } from "react";
import styled from "styled-components";
import { Divider,Pagination} from 'antd';
import { useNavigate } from 'react-router-dom';
import MemberApi from '../../../../../api/MemberApi';
import IqModal from '../../../../views/MyPage/section/Iquiry/IqModal'
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';



const IqList=()=> {
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

  const userInfo = useSelector((state) => state.user.info)

//   const columns = [
//     {
//       title: '문의유형',
//       dataIndex: 'category',
//     },
//     {
//         title: '문의내용',
//         dataIndex: 'content',
//     },
//     {
//         title: '문의 날짜',
//         dataIndex: 'createTime',
//     },
//     {
//         title: '상태',
//         dataIndex: 'qnaStatus',
//     },
//     {
//         title: '답장',
//         dataIndex: 'modal',
//         key: 'modal',
//         render: () => <button onClick={()=>{setModalOpen(true)}}>답장</button>
//     }
// ];

  /** qna 목록을 가져오는 useEffect */
  useEffect(() => {
    const qnaData = async()=> {
      try {
        const res = await MemberApi.myQnalist(userInfo.userIndex, currentPage, pageSize);
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
    <div>
    <Table hover className='table-container'>
      <thead>
        <tr>
          <th width = "130px">문의유형</th>
          <th width = "*">제목</th>
          <th width = "130px">문의일자</th>
          <th width = "90px">문의상태</th>
          <th style={{width : "100px"}}/>
        </tr>
      </thead>
      <tbody>
      {qnaList&&qnaList.map((qnaList, id) => (
        <tr key={id}>
          <td>{qnaList.category}</td>
          <td>{qnaList.title}</td>
          <td>{qnaList.createTime}</td>
          <td>{qnaList.qnaStatus}</td>
          <td><button className='qnaBtn' onClick={()=>{setModalText(qnaList); setModalOpen(true); setIndex(qnaList.index);}}>답변 확인</button>
            {modalOpen && <IqModal setModalOpen={setModalOpen} />}
          </td>
        </tr>
        ))}
        </tbody>
    </Table>
      </div>
      <IqModal open={modalOpen} close={close} header="답변 확인">
        <Table>
          <tr className='reply-tr'>
            <th className='reply-th'>제목</th>
            <td>{modalText.title}</td>
          </tr>
          <tr className='reply-tr'>
            <th className='reply-th'>문의 내용</th>
            <td>{modalText.content}</td>
          </tr>
          <tr className='reply-tr'>
            <th className='reply-th'>답장내용</th>
            <td>{modalText.reply}</td>
          </tr>
        </Table>
      </IqModal>

    {/* {modalOpen && <IqModal open={open} close={close} index={index}/>}
    <Table columns={columns} dataSource={qnaList} size="middle"/> */}
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
tr{
    height: 35px;
}
.qnaBtn{
  border: none;
}
.table-container{
  text-align: center;
  justify-content: center; //왜 중앙으로 안바뀌냐 
}
.reply-tr{
  margin: 20px;
  text-align: center;
}
.reply-th{
  width: 100px;
}
`;

