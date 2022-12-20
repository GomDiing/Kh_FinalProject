import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate} from "react-router-dom";
import styled from 'styled-components';
import AdminApi from '../../../../../api/AdminApi';


const QnaModal = (props) => {
    // const params = useParams().index;
    const navigate = useNavigate();
    console.log(props.index);

    const [inputReply, setInputReply] = useState("");
    // 문의 답장 값을 담아줌
    const onChangeReply=(e)=>{setInputReply(e.target.value);}

    // 문의 답장 전송 호출
    const onClickReply=async(e)=>{
        if(inputReply.length <= 5 || inputReply.length >= 1000) {
        alert('문의 사항을 최소 10 ~ 1000글자 이내로 부탁드립니다.');
        e.preventDefault();
    } else {
        const res = await AdminApi.qnaReply(inputReply, props.index);
        console.log("답장 : " + inputReply);
        if(res.data === true) {
            alert('문의가 정상 전송 되었습니다.');
            navigate('/admin/inquiry')
        } else {
            alert('문의 전송이 실패 하였습니다.');
            e.preventDefault();
        }
    }
}

    const { open, close, header,content, title, reply } = props;
    return (
        <QWrap>

        <div className={open ? 'openModal modal' : 'modal'}>
            {open && 
                <section>
                    <header>
                        {header}
                        <button className='close' onClick={close}>
                            &times;
                        </button>
                    </header>
                    <main>
                    {props.children}

                    {/* <Table>
                  <tr>
                    <th>제목</th>
                    <td>왜 안나오냐{title}</td>
                  </tr>
                  <tr>
                    <th>문의 내용</th>
                    <td>{content}</td>
                  </tr>
                  <tr>
                    <th>문의 답장</th>
                    <td>{reply}</td>
                  </tr>
                </Table> */}
                    {/* <textarea className='qna-replybox' value={inputReply} onChange={onChangeReply}/> */}
                    </main>
                    <footer>
                        {/* <button className='submit' onClick={onClickReply}>Submit</button> */}
                        <button className='close' onClick={close}>close</button>
                    </footer>
                </section>
            }
        </div>
        </QWrap>

    );
};
export default QnaModal;

const QWrap=styled.div`

`;