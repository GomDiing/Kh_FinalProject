import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useState } from "react";
import styled from "styled-components";
import { DaumPostcodeEmbed } from "react-daum-postcode";
import { useNavigate } from "react-router-dom";
import PopupDom from "../../views/SignPage/PopupDom";
import MemberApi from "../../../api/MemberApi";
import { useDispatch } from 'react-redux';
import { loginActions } from '../../../util/Redux/Slice/userSlice';

const SignWrap = styled.div`
    width: 100%;
    background-color: #d2d2d2;
    min-width: 930px;
    .signwrap{
        min-height: 100vh;
        margin: 0 auto;
        width: 70%;
        background-color: #f5f5f5;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .logincontent{
        margin-top: 40px;
    }
    .inputContainer{
        margin-top: 20px;
    }
    h2, .login-link {
        margin: 10px;
        color: #232323;
    }
    .login-link:hover {
        font-weight: bold;
    }
    .signupHead{
        display: flex;
        justify-content: center;
        img{
        width: 250px;
        height: 150px;
        }
    }
    label{
        margin:10px 0;
        font-size: 20px;
        display: flex;
        justify-content: center;
        opacity: 60%;
    }
    .input-group{
        justify-content: center;
    }
    input{
        width: 350px;
        height: 40px;
        border: 0px solid black;
    }
    .btn-group{
        display: flex;
        margin: 20px auto;
        width: 40%;
    }
    p{
        cursor: pointer;
        margin: 0;
    }
    img{
        cursor: pointer;
    }
    .buttonContainer{
        display: block;
        margin: 20px auto;
    }
    .submitbtn{
        width: 402px;
        height: 52px;
        padding: 12px;
        font-size: 20px;
    }
    .AddrBtn{
        display: flex;
        justify-content: center;
    }
    button{
        border: 0px solid #86868b;
        border-radius: 20px;
        margin-top: 30px;
        background-color: #999999;
        color: white;
    }
    p:hover{
        color: #86868b;
    } 
    button:hover{
        background-color : #86868b;
    }
    .fail-message {
        text-align: center;
        margin-top: 5px;
        color: #86868b;
        font-size: 14px;
        font-weight: bold;
    }
    .reg-input {
        border: 1px solid red;
    }
    @media (max-width:1200px){
        .signwrap{
            width: 100%;
        }
} 
`
const postCodeStyle = {
display: "block",
position: "relative",
top: "2%",
right: "2%",
width: "500px",
height: "500px",
padding: "7px",
};

function Social() {
    const location = useLocation();
    const Navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [inputName, setInputName] = useState('');
    const [address, setAddress] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [type, setType] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isName, setIsName] = useState(false);

    useEffect(() => {
        const AccInfo = location.search
        console.log(AccInfo);
        let params = new URLSearchParams(AccInfo);
        setInputName(params.get('name'));
        console.log(inputName)
        setInputEmail(params.get('email'));
        console.log(inputEmail);
        setType(params.get('providerType'));
        console.log(type);
        const name = params.get('name')
        const email = params.get('email')
        const provider_type = params.get('providerType')
        const join = params.get('isJoin');
        if(join == 1) {
            const data = {
                userName : name,
                userEmail : email,
                userProvider_type : provider_type,
            }
            dispatch(loginActions.setUserInfo({data}));
            
            alert('로그인 성공')
            Navigate('/')
        } 
    },[])

    // 주소 
    let [fullAddress, setFullAddress] = useState('');
    // 도로명 주소
    const [road, setRoad] = useState("");
    // 지번 주소
    const [jibun, setJibun] = useState("");
    // 우편 번호
    const [postCode, setPostCode] = useState("");

    const onChangeAddress = e => setAddress(e.target.value);

    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);

    const checkName = e => {
        const value = e.target.value;
        setInputName(value);
        const regEx = /^[ㄱ-ㅎ|가-힣]+$/;
        if(regEx.test(value)) {
            if(value.length > 1) {
                setIsName(true);
            }
            }
            else setIsName(false);
        }

    const handlePostCode = (data) => {
    setFullAddress(data.address);
    setRoad(data.roadAddress);
    setJibun(data.jibunAddress);
    setPostCode(data.zonecode);
    setIsOpen(false);
    data.preventDefault();
    }

    console.log(inputName);
    console.log(inputEmail);
    console.log(road);
    console.log(jibun);
    console.log(address);
    console.log(postCode);
    console.log(type);

    const onClickSign = async () => {
    try {
        const response = await MemberApi.socialSign(inputName, inputEmail, road, jibun, address, postCode, type);
        if(response.data.statusCode === 200) {
        alert("회원가입 완료");
    } Navigate('/login');
    } catch (e) {
        alert("이러지마.....ㅠㅠ");
    }
    }

    const onKeyPress = e => {
        if(e.key === "Enter") {
            onClickSign();
        }
    }
    
    return (
        <SignWrap>
    <div className='signwrap'>
        <form className="form">
        <div className="form-inner">
            <div>
            <div className='signupHead'>
                <a href='/'><img src='images/TCat.jpg' alt=''></img></a>
            </div>
            </div>
            <div className="input-wrapper">
                <label for="sign-name">Name</label>
                <div className="input-group">
                <input type="text" value={inputName} className={inputName.length > 0 && !isName && 'reg-input'} id="sign-name" onChange={checkName} data-lpignore="true" />
            </div>
            <div className='fail-message'>
            {inputName.length > 0 && !isName && <span>이름은 한글 2자 이상 입력해주세요.!</span>}
            </div>
            </div>
            <div className="input-wrapper">
                <label for="sign-email">Email</label>
                <div className="input-group">
                <input type="email" id="sign-email" value={inputEmail} readOnly data-lpignore="true" />
            </div>
            </div>
            <div className='addrContainer' id='popupDom'>
                <div>
                <div className='AddrBtn'>
                    <button className="btn btn--primary" type='button' onClick={onOpen}>Address</button>
                {isOpen && (
                    <>
                    <button className='btn btn--primary' onClick={onClose} type='button'>닫기</button>
                    <PopupDom>
                        <DaumPostcodeEmbed style={postCodeStyle} onComplete={handlePostCode} />
                    </PopupDom>
                    </>
                )}
                </div>  
                <div className='inputContainer'>
                    <input type='text' placeholder='선택된 주소' value={fullAddress}  />
                    <input type='text' value={address} onChange={onChangeAddress} onSubmit={onKeyPress} placeholder='상세 주소 입력'/>
                </div>
                </div>
            </div>
            <div>
            </div>
                <div className="btn-group">
                <button style={{width : '402px', height : '52px', padding : '12px', fontSize : '20px' }} className="btn btn--primary" type='button' onClick={onClickSign}>Sign in</button>
                </div>
            </div>
        </form>
    </div>
    </SignWrap>
    )
}

export default Social;