import { useState } from "react";
import styled from "styled-components"
import Modal from "../../../../../../../util/Modal/Modal";
const BodyContainer = styled.div`
    .Topic{
        font-size: 18px;
        border-bottom:1px solid silver;
    }
    td{
        cursor: pointer;
        width: 600px;
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
    th{
        width: 100px;
        text-align: center;
        /* border-bottom:1px solid silver; */
    }
    
`
const notice = [
    {

        id : '1',
        categories : 'Notice',
        title : "1번공지",
        text : '2번 공지사항 내용입니다.2번 공지사항 내용입니다.2번 공지사항 내용입니다.2번 공지사항 내용입니다.2번 공지사항 내용입니다.2번 공지사항 내용입니다.'
    },
    {
        id : '2',
        categories : 'Notice',
        title : "2번공지",
        text : '2번 공지사항 내용입니다.'
    },
    {
        id : '3',
        categories : 'Event',
        title : "3번공지",
        text : '3번 이벤트 내용입니다.'
    },
    {
        id : '4',
        categories : 'Event',
        title : "4번공지",
        text : '4번 이벤트 내용입니다.'
    },
]

const NoticeModalBody = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [inputText, setInputText] = useState('');

    const openModal = (e) =>{
        setModalOpen(true)
        setInputText(e)    
    }
    const closeModal = () =>{
        setModalOpen(false)
    }
    
    return(
        <BodyContainer>
            <div className='NoticeOption'>
                    <table>
                        <tr>
                            <th className="Topic">제목</th>
                            <th className="Topic">내용</th>
                        </tr>
                        {notice.map(c=>(
                            <tr onClick={()=>openModal(c.text)}>
                                <th>{c.title}</th>
                                <td>{c.text}</td>
                            </tr>
                        ))}
                    </table>
            </div>
            <Modal open={modalOpen} close={closeModal} header={"공지사항"}><div>{inputText}</div></Modal>
        </BodyContainer>
    );
}

export default NoticeModalBody;