import { useState,useEffect,useParams } from "react";
import styled from "styled-components";
import TopBar from "../Tool/TopBar";
import AdminApi from "../../../../api/AdminApi";
import QnaModal from "./QnaModal";
import { Pagination } from "antd";


const Inquiry=()=>{
  const [qnaList, setQnaList] = useState([]);
  const [pageSize, setPageSize] = useState(7); // 한페이지에 몇개씩 있을건지
  const [totalCount, setTotalCount] = useState(0); // 총 데이터 숫자
  const [currentPage, setCurrentPage] = useState(1); // 현재 몇번째 페이지인지
  
    // 모달
    const [modalOpen, setModalOpen] = useState(false);
    // 모달 내용
    const [modalText, setModalText] = useState('');
  
  const closeModal = () => {
    setModalOpen(false);
  }

  useEffect(() => {
    const qnaData = async()=> {
      try {
        const res = await AdminApi.qnaList(currentPage, pageSize);
        if(res.data.statusCode === 200){
          console.log(res.data.message);
          setQnaList([...qnaList, ...res.data.results.qnaDTOList]);
          console.log(res.data.results);
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
    qnaData();
  }, [currentPage]);

  return(
    <InquiryBlock>
        <TopBar name="큐앤에이 관리"/>
          <div className="admin-qnalist-container">
              <table>
                <thead>
                  <tr>
                    <th width = "90px">문의상태</th>
                    <th width = "120px">문의유형</th>
                    <th width = "*">제목</th>
                    <th width = "120px">고객명</th>
                    <th width = "120px">문의일자</th>
                    <th style={{width : "80px"}}/>
                  </tr>
                </thead>
                  
                <tbody key={qnaList.id}>
              {qnaList&&qnaList.map(qnaList=>(
                  <tr>
                    <td>{qnaList.qnaStatus}</td>
                    <td>{qnaList.category}</td>
                    <td>{qnaList.title}</td>
                    <td>{qnaList.id}</td>
                    <td>{qnaList.createTime}</td>
                    <td><button onClick={()=>{setModalText(qnaList); setModalOpen(true);}}>답장</button>
                      {modalOpen && <QnaModal setModalOpen={setModalOpen}/>}
                    </td>
                  </tr>
                  ))}
                  </tbody>
              </table> 
              
              <QnaModal open={modalOpen} close={closeModal} header="문의 답장하기">
              <div>{modalText.member_id}</div>
              <div>{modalText.title}</div>
              <div>{modalText.content}</div>
              </QnaModal>
            </div>
            <Pagination className="d-flex justify-content-center"
             total={totalCount}  //총 데이터 갯수
             current={currentPage} 
             pageSize={pageSize}
             onChange={(page) => {setCurrentPage(page); setQnaList([]);}} //숫자 누르면 해당 페이지로 이동
            />
        </InquiryBlock>
        
    );
}
export default Inquiry;

const InquiryBlock=styled.div`
    margin:0 auto;
    box-sizing: border-box;
  .admin-qnalist-container {
    width: 70vw;
    margin : 10px;
    display: flex;
    border: 1px solid black;
    height: 60%;
    flex-direction: column;
    text-align: center;
    padding: 3rem;
  }
table,th,td {
  border: 1px solid black;
}
  button{
    width: 80px;
  }
`;