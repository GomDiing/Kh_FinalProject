import { useState } from 'react';
import styled from 'styled-components';
import CancelModal from './CancelModal';

const ModalStyle2 = styled.div`
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
        height: 450px;
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
    .modal > section > footer button {
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

const Body = () => {
    return(
      <div style={{textAlign: 'center'}}>
        <h3>정말 취소하시겠습니까?</h3>
          <ul>
            <li>공연 시작 1주일 전에 취소 시 수수료 10%가 발생하는 점 주의 부탁드립니다.</li>
            <li>공연 취소 시 환불 되기까지 1주일 정도의 소요 시간이 있습니다.</li>
            <li>공연 당일은 불가피하게 취소가 안됩니다.</li>
          </ul>
      </div>
    )
  }

function ReserveDetailModal (props) {
      // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
    const { open, close, header, body, cancel } = props;
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <ModalStyle2>
        <div className={open ? 'openModal modal' : 'modal'}>
        {open ? (
            <section>
            <header>
                {header}
                <button className="close" onClick={close}>
                &times;
                </button>
            </header>
            <main>{body}</main>
            <footer className='modal-footer'>
                <button className='close' onClick={openModal}>
                <span className='cancel-button'>결제 취소하기</span>
                </button>
                {modalOpen && <CancelModal open={openModal} body={<Body />} cancel={cancel} close={closeModal} />}
                <button className="close" onClick={close}>
                돌아가기
                </button>
            </footer>
            </section>
        ) : null}
        </div>
    </ModalStyle2>
    );
}

export default ReserveDetailModal;