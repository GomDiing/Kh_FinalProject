import React, { useState } from 'react';
import { useNavigate} from "react-router-dom";
import styled from 'styled-components';
// import AdminApi from '../../../../../api/AdminApi';


const AccuseModal = (props) => {
    // const params = useParams().index;
    const navigate = useNavigate();
    // console.log(props.index);

    const [inputReply, setInputReply] = useState("");
    // 문의 답장 값을 담아줌
    const onChangeReply=(e)=>{setInputReply(e.target.value);}

    // 문의 답장 전송 호출
    const onClickReply=async(e)=>{
}

    const { open, close, header} = props;
    return (
        <AccuseModalBlock>
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
                    {/* {props.children} */}
                    </main>
                    <footer>
                        <button className='submit' onClick={onClickReply}>Submit</button>
                        <button className='close' onClick={close}>close</button>
                    </footer>
                </section>
            }
        </div>
        </AccuseModalBlock>

    );
};
export default AccuseModal;

const AccuseModalBlock=styled.div`

`;