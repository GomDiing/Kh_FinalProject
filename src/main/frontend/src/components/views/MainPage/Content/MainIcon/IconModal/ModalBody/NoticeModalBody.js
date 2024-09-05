import { useEffect, useState } from "react";
import styled from "styled-components"
import AdminApi from "../../../../../../../api/AdminApi";
import Modal from "../../../../../../../util/Modal/Modal";
import { Pagination } from "antd";

const BodyContainer = styled.div`
    .Topic{
        font-size: 18px;
        border-bottom:1px solid silver;
    }
    td{
        opacity: 60%;
        cursor: pointer;
        width: 500px;
        max-width: 500px;
        overflow: hidden;
        /* border-bottom:1px solid silver; */
        margin:5px 0;
        white-space: normal;
        word-wrap: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    td:hover{
        font-weight: bold;
        opacity: 100%;
    }
    th{
        width: 100px;
        max-width: 100px;
        text-overflow: ellipsis;
        overflow:hidden;
        white-space: nowrap;
        /* border-bottom:1px solid silver; */
    }
    
`
// const notice = [
//     {

//         id : '1',
//         categories : 'Notice',
//         title : "1번공지",
//         text : '2번 공지사항 내용입니다.2번 공지사항 내용입니다.2번 공지사항 내용입니다.2번 공지사항 내용입니다.2번 공지사항 내용입니다.2번 공지사항 내용입니다.'
//     },
//     {
//         id : '2',
//         categories : 'Notice',
//         title : "2번공지",
//         text : '2번 공지사항 내용입니다.'
//     },
//     {
//         id : '3',
//         categories : 'Event',
//         title : "3번공지",
//         text : '3번 이벤트 내용입니다.'
//     },
//     {
//         id : '4',
//         categories : 'Event',
//         title : "4번공지",
//         text : '4번 이벤트 내용입니다.'
//     },
// ]

const NoticeModalBody = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const [currentPage , setCurrentPage] = useState(1);
    const [notice , SetNotice] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 5;

    const openModal = (e) =>{
        setModalOpen(true)
        setInputText(e)    
    }
    const closeModal = () =>{
        setModalOpen(false)
    }

    useEffect (() =>{
        const asyncFunction = async()=>{
            try{
                const res = await AdminApi.noticeInfo(currentPage ,pageSize);
                console.log('test')          
                if(res.data.statusCode === 200){
                    SetNotice(res.data.results.noticeDTOList);
                    setCurrentPage(res.data.results.page);
                    setTotalCount(res.data.results.totalResults);
                }
            }catch(e){
                console.log(e);
            }           
        }
    asyncFunction();
}, [currentPage]);
    
    return(
        <BodyContainer>
            <div className='NoticeOption'>
                    <table>
                        <tr>
                            <th className="Topic">제목</th>
                            <th className="Topic">내용</th>
                        </tr>
                        {notice.map((notice)=>(
                            <tr onClick={()=>openModal(notice.content)}>
                                <th>{notice.title}</th>
                                <td>{notice.content}</td>
                            </tr>
                        ))}
                    </table>

                    <Pagination className="d-flex justify-content-center"
                        total={totalCount}
                        current={currentPage} 
                        pageSize={pageSize}
                        onChange={(page) => {setCurrentPage(page);}}
                    />
                        
            </div>
            <Modal open={modalOpen} close={closeModal} header={"공지사항"}><div>{inputText}</div></Modal>
        </BodyContainer>
    );
}

export default NoticeModalBody;