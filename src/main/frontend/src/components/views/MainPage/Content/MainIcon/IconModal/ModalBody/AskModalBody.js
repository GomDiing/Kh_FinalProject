import { useState } from "react"
import styled from "styled-components"

const AskBodyContainer = styled.div`
    .SelectContainer{
        margin: 10px 0;
    }
    select{
        width: 100%;
        height: 40px;
        border-radius: 10px;
    }
    textarea{
        width: 100%;
        height: 400px;
        border-radius: 10px;
        resize: none;
    }
    .close {
    padding: 6px 12px;
    color: black;
    background-color: #dee2e6;
    border-radius: 5px;
    font-size: 13px;
    }
`

const AskModalBody = () =>{
    const [inputText , setInputText] = useState('');
    
    const TextChange = (e) =>{
        setInputText(e.target.value)
        console.log(inputText)
    } 

    return(
        <AskBodyContainer>
            <div className="SelectContainer">
                <select>
                    <option value="login">로그인</option>
                    <option value="buy">예매</option>
                    <option value="refund">환불</option>
                    <option value=""></option>
                </select>
            </div>
            <textarea onChange={TextChange}></textarea>
        </AskBodyContainer>
    )
}

export default AskModalBody