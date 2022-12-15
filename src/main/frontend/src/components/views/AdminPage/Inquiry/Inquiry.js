import { useState,useEffect,useParams } from "react";
import styled from "styled-components";
import TopBar from "../Tool/TopBar";
import Modal from "../../../../util/Modal/Modal"
import AdminApi from "../../../../api/AdminApi";
import QnaModal from "./QnaModal";

const Inquiry=()=>{
  const [inputReply, setInputReply] = useState("");
  const [qnaList, setQnaList] = useState([]);
  // const params = useParams().index;


    // 모달
    const [modalOpen, setModalOpen] = useState(false);
    // 모달 내용
    const [modalText, setModalText] = useState('');
    // 문의 내용을 가져와서 담기 위한 변수
    const [inquireInfo, setInquireInfo] = useState('');
  
  const closeModal = () => {
    setModalOpen(false);
  }

  useEffect(() => {
    const noticeData = async()=> {
      try {
        const response = await AdminApi.qnaList();
        setQnaList(response.data);
        console.log(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    noticeData();
  }, []);

  return(
    <InquiryBlock>
        <TopBar name="큐앤에이 관리"/>
          <div className="container">
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
                  
              {qnaList.map(data=>(
                <tbody key={data.member_id}>
                  <tr>
                    <td>{data.status}</td>
                    <td>{data.category}</td>
                    <td>{data.title}</td>
                    <td>{data.member_id}</td>
                    <td>{data.createTime}</td>
                    <td><button onClick={()=>{setModalText(data); setModalOpen(true);}}>답장</button>
                      {modalOpen && <QnaModal setModalOpen={setModalOpen}/>}
                    </td>
                  </tr>
                  </tbody>
                  ))}
              </table> 
              
              <QnaModal open={modalOpen} close={closeModal} header="문의 답장하기">
              <div>{modalText.member_id}</div>
              <div>{modalText.title}</div>
              <div>{modalText.content}</div>
              </QnaModal>
            </div>
        </InquiryBlock>
        
    );
}
export default Inquiry;

const InquiryBlock=styled.div`
    margin:0 auto;
    box-sizing: border-box;
  /* width: 100vw; */
  .container {
    width: 100vw;
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