import styled from 'styled-components';

const ModalStyle = styled.div`
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
    }
    .modal > section {
        width: 90%;
        max-width: 700px;
        width: 700px;
        height: auto;
        margin: 0 auto;
        border-radius: 0.3rem;
        background-color: #fff;
        /* 팝업이 열릴때 스르륵 열리는 효과 */
        animation: modal-show 0.3s;
        overflow: hidden;
        text-align: center;
        align-items: center;
    }
    .modal > section > header {
        position: relative;
        padding: 16px 64px 16px 16px;
        background-color: #f1f1f1;
        font-weight: 700;
    }
    .modal > section > header button {
        position: absolute;
        top: -1;
        right: 8px;
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
        /* padding: 6px 12px; */
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
`;

function FindModal (props) {
    // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
    const { open, close, type, deleteCancel, footer, header, body } = props;
    return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <ModalStyle>
        <div className={open ? 'openModal modal' : 'modal'}>
        {open ? (
            <section>
            <header>
                {header}
                {/* <button className="close" onClick={close}>
                &times;
                </button> */}
            </header>
            <main>{body}</main>
            <footer className='modal-footer'>
                {footer}
                {type === "DELETE" && <button className="close" onClick={deleteCancel}>확인</button>}
                <button className="close" onClick={close} >
                Close
                </button>
            </footer>
            </section>
        ) : null}
        </div>
    </ModalStyle>
    );
}

export default FindModal;