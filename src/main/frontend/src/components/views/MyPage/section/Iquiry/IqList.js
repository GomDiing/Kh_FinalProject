import React from 'react';
import { useState,useEffect } from "react";
import { Divider,Pagination} from 'antd';
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

  const userInfo = useSelector((state) => state.user.info)

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
      <thead >
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
          <td  style={{ padding : '11px'}} >{qnaList.category}</td>
          <td  style={{ padding : '11px'}}>{qnaList.title}</td>
          <td  style={{ padding : '11px'}}>{qnaList.createTime}</td>
          <td  style={{ padding : '11px'}}>{qnaList.qnaStatus}</td>
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

