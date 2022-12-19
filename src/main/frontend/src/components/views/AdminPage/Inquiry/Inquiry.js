import { useState,useEffect,useParams } from "react";
import styled from "styled-components";
import TopBar from "../Tool/TopBar";
import AdminApi from "../../../../api/AdminApi";
import QnaModal from "./QnaModal";
import { Pagination } from "antd";
import Table from 'react-bootstrap/Table';


const Inquiry=()=>{
  const [qnaList, setQnaList] = useState([]);
  const [pageSize, setPageSize] = useState(10); // 한페이지에 몇개씩 있을건지
  const [totalCount, setTotalCount] = useState(0); // 총 데이터 숫자
  const [currentPage, setCurrentPage] = useState(1); // 현재 몇번째 페이지인지
  const [qIndex, setQindex] = useState('');
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
          console.log(res.data.results);
          setQnaList([...qnaList, ...res.data.results.qnaDTOList]);
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
  }, [currentPage, pageSize]);

  return(
    <InquiryBlock>
        <TopBar name="큐앤에이 관리"/>
          <div className="admin-qnalist-container">
          <Table striped bordered hover>
                <thead>
                  <tr>
                    <th width = "120px">문의유형</th>
                    <th width = "*">제목</th>
                    <th width = "120px">고객명</th>
                    <th width = "120px">문의일자</th>
                    <th width = "90px">문의상태</th>
                    <th style={{width : "80px"}}/>
                  </tr>
                </thead>
                <tbody>
                {qnaList&&qnaList.map((qnaList, id) => (
                  <tr key={id}>
                    <td>{qnaList.category}</td>
                    <td>{qnaList.title}</td>
                    <td>{qnaList.id}</td>
                    <td>{qnaList.createTime}</td>
                    <td>{qnaList.qnaStatus}</td>
                    <td><button onClick={()=>{setModalText(qnaList); setModalOpen(true); setQindex(qnaList.index);}}>답장</button>
                      {modalOpen && <QnaModal setModalOpen={setModalOpen} />}
                    </td>
                  </tr>
                  ))}
                  </tbody>
            </Table>
              <QnaModal open={modalOpen} close={closeModal} index={qIndex} header="문의 답장하기">
                <Table>
                  <tr>
                    <th>작성자</th>
                    <td>{modalText.id}</td>
                  </tr>
                  <tr>
                    <th>제목</th>
                    <td>{modalText.title}</td>
                  </tr>
                  <tr>
                    <th>문의 내용</th>
                    <td>{modalText.content}</td>
                  </tr>
                </Table>
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
    height: 60%;
    flex-direction: column;
    text-align: center;
  }
  button{
    width: 80px;
    border: none;
  }

`;