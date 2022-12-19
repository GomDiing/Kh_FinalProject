import React, { useState } from 'react';
import AdminApi from '../../../../api/AdminApi';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';

const QWrap = styled.div`
.modal {
    display: none;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.6);
}
.modal button {
    outline: none;
    cursor: pointer;
    border: 0;
    margin: 0 5px;
}
.modal > section {
    width: 90%;
    max-width: 4500px;
    width: 700px;
    height: auto;
    margin: 0 auto;
    border-radius: 0.3rem;
    background-color: #fff;
    /* 팝업이 열릴때 스르륵 열리는 효과 */
    animation: modal-show 0.3s;
    overflow: hidden;
}
.modal > section > header {
    position: relative;
    padding: 16px 64px 16px 16px;
    background-color: #f1f1f1;
    font-weight: 700;
}
.modal > section > header button {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 30px;
    font-size: 21px;
    font-weight: 700;
    text-align: center;
    color: #999;
    background-color: transparent;
}
.modal > section > main {
    padding: 16px;
    border-bottom: 1px solid #dee2e6;
    border-top: 1px solid #dee2e6;
}
.modal > section > footer {
    padding: 12px 16px;
    text-align: right;
}
.submit {
    padding: 6px 12px;
    color: #fff;
    background-color: #6c757d;
    border-radius: 5px;
    font-size: 13px;
}
.close {
    padding: 6px 12px;
    color: black;
    background-color: #dee2e6;
    border-radius: 5px;
    font-size: 13px;
}
.modal.openModal {
    display: flex;
    align-items: center;
    /* 팝업이 열릴때 스르륵 열리는 효과 */
    animation: modal-bg-show 0.3s;
}
@keyframes modal-show {
    from {
        opacity: 0;
        margin-top: -50px;
    }
    to {
        opacity: 1;
        margin-top: 0;
    }
    }
    @keyframes modal-bg-show {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
.qna-replybox{
    width: 95%;
    height: 300px;
    border-radius: 10px;
    resize: none;
    padding: 10px;
}
`

const QnaModal = (props) => {
    const navigate = useNavigate();
    const [inputReply, setInputReply] = useState("");

    // 문의 답장 값을 담아줌
    const onChangeReply=(e)=>{setInputReply(e.target.value);}
    
    // 문의 답장 전송 호출
    const onClickReply=async(e)=>{
        if(inputReply.length <= 5 || inputReply.length >= 1000) {
        alert('문의 사항을 최소 5 ~ 1000글자 이내로 부탁드립니다.');
        e.preventDefault();
    } else {
        const res = await AdminApi.qnaReply(inputReply, index);
        // console.log("답장 : " + inputReply + index);
        if(res.data.statusCode === 200) {
            alert('문의가 정상 전송 되었습니다.');
            close(true);
            navigate('/admin/inquiry')
            
        } else {
            alert('문의 전송이 실패 하였습니다.');
            e.preventDefault();
        }
    }
}
    const { open, close, header, index } = props;

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
                    <textarea className='qna-replybox' value={inputReply} onChange={onChangeReply} placeholder="답장하기"/>
                    </main>
                    <footer>
                        <button className='submit' onClick={onClickReply}>Submit</button>
                        <button className='close' onClick={close}>close</button>
                    </footer>
                </section>
            }
        </div>
        </QWrap>
    );
};
export default QnaModal;