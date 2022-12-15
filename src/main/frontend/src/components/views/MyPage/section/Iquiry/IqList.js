import { Pagination } from 'antd';
import React from 'react';
import { useState,useEffect,useParams } from "react";
import styled from "styled-components";
import MemberApi from '../../../../../api/MemberApi';


function IqList() {

  const [pageSize, setPageSize] = useState(4); // 한페이지에 몇개씩 있을건지
  const [totalCount, setTotalCount] = useState(0); // 총 데이터 숫자
  const [currentPage, setCurrentPage] = useState(1);
  const [myQnaList, setMyQnaList] = useState([]);

  // 모달
  const [modalOpen, setModalOpen] = useState(false);
  // 모달 내용
  const [modalText, setModalText] = useState('');
  // 문의 내용을 가져와서 담기 위한 변수
  const [inquireInfo, setInquireInfo] = useState('');

const closeModal = () => {
  setModalOpen(false);
    }
    // 내 문의 사항 가져오는 useEffect
    useEffect(() => {
        const memberData = async()=> {
          try {
            const res = await MemberApi.myQnalist(currentPage, pageSize);
            if(res.data.statusCode === 200){
              setMyQnaList([...myQnaList, ...res.data.results.memberDTOList]);
              console.log(setMyQnaList);
              // 페이징 시작
              setTotalCount(res.data.results.totalResults); 
              // db에서 잘라준 size 별로 잘랐을때 나온 페이지 수
              setCurrentPage(res.data.results.page);
            } else{
              alert("리스트 조회가 안됩니다.")
            }
          } catch (e) {
            console.log(e);
          }
        };
        memberData();
      }, [currentPage]);

    return (
        <MypageQnaBlock>

        <div className='qnalist-container'>
            <table className='qnalist-table'>
                <thead>
                  <tr>
                    <th width = "110px">문의상태</th>
                    <th width = "110px">문의유형</th>
                    <th width = "*">제목</th>
                    <th width = "120px">문의일자</th>
                    <th width = "120px"/>
                  </tr>
                </thead>
                  
                <tbody>
                {myQnaList && myQnaList.map(data=>(
                  <tr>
                    <td>{data.status}</td>
                    <td>{data.category}</td>
                    <td>{data.title}</td>
                    <td>{data.createTime}</td>
                    <td><button onClick={()=>{setModalText(data); setModalOpen(true);}}>답장</button>
                      {/* {modalOpen && <QnaModal setModalOpen={setModalOpen}/>} */}
                    </td>
                  </tr>
                  ))}
                  </tbody>
              </table> 
        </div>
        <Pagination className="d-flex justify-content-center"
         total={totalCount}  //총 데이터 갯수
        current={currentPage} 
        pageSize={pageSize}
        onChange={(page) => {setCurrentPage(page); setInquireInfo([]);}}
        />
        </MypageQnaBlock>
    )
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