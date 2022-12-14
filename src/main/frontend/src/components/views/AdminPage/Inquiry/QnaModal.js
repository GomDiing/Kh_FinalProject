import { async } from '@firebase/util';
import React, { useState, useParams } from 'react';
import AdminApi from '../../../../api/AdminApi';
import { useNavigate} from "react-router-dom";
import './qnaModal.css';
// import '../App';
// import './Modal.css';

const QnaModal = (props) => {
    // const params = useParams().index;
    const navigate = useNavigate();

    const [inputReply, setInputReply] = useState("");
    // 문의 답장 값을 담아줌
    const onChangeReply=(e)=>{setInputReply(e.target.value);}

    // 문의 답장 전송 호출
    const onClickReply=async(e)=>{
        if(inputReply.length <= 5 || inputReply.length >= 1000) {
        alert('문의 사항을 최소 10 ~ 1000글자 이내로 부탁드립니다.');
        e.preventDefault();
    } else {
        const res = await AdminApi.qnaReply(inputReply);
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

    const { open, close, header ,submit, title} = props;

    return (
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
                    <div>작성자</div>
                    {props.children}
                    <textarea className='qna-replybox' value={inputReply} onChange={onChangeReply}/>
                    </main>
                    <footer>
                    {submit &&
                        <button className='submit' onClick={submit}>Submit</button>
                    }
                        <button className='close' onClick={close}>close</button>
                        <button className='submit' onClick={onClickReply}>Submit</button>
                    </footer>
                </section>
            }
        </div>
    );
};
export default QnaModal;