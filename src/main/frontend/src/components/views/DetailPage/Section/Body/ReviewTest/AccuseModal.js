import { useState } from 'react';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form';
import DetailApi from '../../../../../../api/DetailApi';
import { useSelector } from 'react-redux';

const AccuseModal= (props)=> {
    const userInfo = useSelector((state) => state.user.info)
    const victimIndex= userInfo.userIndex;

    console.log("신고할 글 index: " + props.index);
    console.log("신고할 아이디 : " + props.memberIndex);

      // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
    const { open, close, header} = props;

    const [reason, setReason] = useState("광고");
    const onChangeSelect=(e)=>{setReason(e.target.value);}


    const onClickAccuse=async()=>{
        try{
            const res = await DetailApi.accuseComment(props.memberIndex,victimIndex,reason,props.index,);
            if(res.data.statusCode === 200) {
                alert(props.title+" "+res.data.message);
                close();
            }
        }catch(e){
            if(e.response.data.statusCode === 400){
                if(e.response.data.errors == null){
                    alert("중복신고 되었습니다.");
                    close();
                } else if(e.response.data.errors !== null){
                    alert("로그인 후 이용 바랍니다.")
                }
            }else{
                console.log(e);
                close();
            }
        }
    };

    return (
    <AccuseModalBlock>
        <div className={open ? 'openModal modal' : 'modal'}>
        {open ? (
            <section>
            <header>
                신고사유
                {header}
                <button className="close" onClick={close}>
                &times;
                </button>
            </header>
            <main>
            <Form.Select value={reason} onChange={onChangeSelect}>
                 <option value="광고">광고</option>
                 <option value="욕설">욕설</option>
                 <option value="기타">기타</option>
            </Form.Select>
                {/* {body} */}
            </main>
            <footer className='modal-footer'>
                <button className='submit' onClick={()=>onClickAccuse(props.index)}>Submit</button>
                <button className='close' onClick={close}>close</button>
            </footer>
            </section>
        ) : null}
        </div>
    </AccuseModalBlock>
    );
}

export default AccuseModal;

const AccuseModalBlock=styled.div`
    .modal {
        display: none;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 30;
        background-color: rgba(0, 0, 0, 0.6);
    }
    .modal button {
        outline: none;
        cursor: pointer;
        border: 0;
    }
    .modal > section {
        width: 90%;
        max-width: 4500px;
        width: 550px;
        height: 180px;
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
        top: 0;
        right: 0;
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
    .close {
        padding: 6px 12px;
        color: #fff;
        background-color: #6c757d;
        border-radius: 5px;
        font-size: 13px;
    }
    .modal.openModal {
        display: flex;
        align-items: center;
        /* 팝업이 열릴때 스르륵 열리는 효과 */
        animation: modal-bg-show 0.3s;
    }
    .cancel-button {
        font-weight: bold;
        color: black;
        padding: 6px 12px;
        color: #fff;
        background-color: #6c757d;
        border-radius: 5px;
        font-size: 13px;
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

`;