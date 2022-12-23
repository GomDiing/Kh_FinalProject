import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PopupDom from './PopupDom';
import DaumPostcode from "react-daum-postcode";
import MemberApi from '../../../api/MemberApi';
import { Link, useNavigate } from 'react-router-dom';

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


function Sign() {

  // 필요한 정보 입력 받기
  const [inputId, setInputId] = useState("");
  const [inputPwd, setInputPwd] = useState("");
  const [pwdCheck, setPwdCheck] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputEmail, setInputEmail] = useState("");

  const [isId, setIsId] = useState(false);
  const [isPwd, setIsPwd] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [isName, setIsName] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isAddress, setIsAddress] = useState(false);
  const [submit, setSubmit] = useState(false);

  // 모달 스타일
  const postCodeStyle = {
    display: "block",
    position: "absolute",
    top: "2%",
    width: "500px",
    height: "500px",
    padding: "7px",
  };

  // 카카오주소 api
  const [isOpen, setIsOpen] = useState(false);
  // 주소 
  let [fullAddress, setFullAddress] = useState("");
  // 도로명 주소
  const [road, setRoad] = useState("");
  // 지번 주소
  const [jibun, setJibun] = useState("");
  // 상세 주소 값
  const [address, setAddress] = useState("");
  // 상세주소 값 담기
  const onChangeAddress = e => {
    if(fullAddress.length <= 0) {
      alert('주소를 먼저 선택해주세요');
      if(address.length <= 0) {
        setIsAddress(false)
      }
    }
    setAddress(e.target.value);
    setIsAddress(true);
  }
  // 우편 번호
  const [postCode, setPostCode] = useState("");
  // 팝업 열기
  const openPostCode = () => setIsOpen(true);
  // 팝업 닫기
  const closePostCode = () => setIsOpen(false);

  /**
   * 
   * @param {Address..} data 
   */
  const handlePostCode = (data) => {
    setFullAddress(data.address);
    console.log(data.roadAddress);
    setRoad(data.roadAddress);
    console.log(data.jibunAddress);
    setJibun(data.jibunAddress);
    console.log(data.zonecode);
    setPostCode(data.zonecode);
    setIsOpen(false);
    data.preventDefault();
  }

  const onChangeId = e => {
    const value = e.target.value;
    setInputId(value);
    // 6 ~ 20자리 영문, 숫자
    const regEx = /^[a-z]+[a-z0-9]{5,19}$/g;
    if(regEx.test(value)) setIsId(true);
    else setIsId(false);
  }

  const onChangePwd = e => {
    const value = e.target.value;
    setInputPwd(value);
    // 8자리에서 16자리 영문, 숫자, 특수문자를 최소 한가지식 포함
    const regEx = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
    if(regEx.test(value)) setIsPwd(true);
    else setIsPwd(false);
  }

  const onChangePwdCheck = e => {
    const value = e.target.value;
    setPwdCheck(value);
    if(inputPwd === value) setIsCheck(true);
    else setIsCheck(false); 
  }
  
  const onChangeName = e => {
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

  const onChangeEmail = e => {
    const value = e.target.value;
    setInputEmail(value);
    const regEx = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    if(regEx.test(value)) setIsEmail(true);
    else setIsEmail(false);
  }
  
  const Navigate = useNavigate();

  useEffect(() => {
    if(isId && isPwd && isCheck && isName && isEmail && isAddress) {
      setSubmit(false);
      return;
    } setSubmit(true);
  }, [isId, isPwd, isCheck, isName, isEmail, isAddress]);

  // 회원가입 시도
  const onClickSign = async () => {
    try {
      const memberRegister = await MemberApi.signup(inputId, inputPwd, inputName, inputEmail, road, jibun, address, postCode)
      if(memberRegister.data.statusCode === 200) {
        alert("<Tcat에 회원가입 해주신 것을 진심으로 감사드립니다>");
        Navigate('/login');
      }
    } catch (e) {
      // 예외처리
      if(e.response.data.statusCode === 400){
        alert(e.response.data.message)
      }else{
        console.log(e);
        console.log("connection fail...");
      }
    }
  }
// 엔터키
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
          <div className='signupHead'>
            <h2>Sign Up</h2><Link style={{textDecoration: 'none'}} to='/login'><h2 className='login-link'>User Login</h2></Link>
          </div>
        </div>
          <div className="input-wrapper">
            <label for="sign-username">User Id</label>
              <div className="input-group">
                <input type="text" value={inputId} className={inputId.length > 0 && !isId && 'reg-input'} id="sign-username" onChange={onChangeId} data-lpignore="true" />
              </div>
              <div className='fail-message'>
              {inputId.length > 0 && !isId && <span className='fail-message'>아이디는 6 ~ 20자리 영,숫자로 입력해주세요!</span>}
              </div>
          </div>
          <div className="input-wrapper">
            <label for="sign-password">Password</label>
              <div className="input-group">
                <input type="password" value={inputPwd} className={inputPwd.length > 0 && !isPwd && 'reg-input'} id="sign-password" onChange={onChangePwd} data-lpignore="true" />
          </div>
          <div className='fail-message'>
          {inputPwd.length > 0 && !isPwd && <span>비밀번호는 8 ~ 16자리 영,숫자,특수문자로 입력해주세요!</span>}
          </div>
          </div>
          <div className="input-wrapper">
            <label for="sign-password-check">Password check</label>
              <div className="input-group">
                <input type="password" value={pwdCheck} className={pwdCheck.length > 0 && !isCheck && 'reg-input'} id="sign-password-check" onChange={onChangePwdCheck} data-lpignore="true" />
          </div>
          <div className='fail-message'>
          {pwdCheck.length > 0 && !isCheck && <span>위 비밀번호랑 일치하지 않습니다!</span>}
          </div>
          </div>

          <div className="input-wrapper">
            <label for="sign-name">Name</label>
              <div className="input-group">
                <input type="text" value={inputName} className={inputName.length > 0 && !isName && 'reg-input'} id="sign-name" onChange={onChangeName} data-lpignore="true" />
          </div>
          <div className='fail-message'>
          {inputName.length > 0 && !isName && <span>이름은 한글 2자 이상 입력해주세요.!</span>}
          </div>
          </div>

          <div className="input-wrapper">
            <label for="sign-email">Email</label>
              <div className="input-group">
                <input type="email" className={inputEmail.length > 0 && !isEmail && 'reg-input'} id="sign-email" value={inputEmail} onChange={onChangeEmail} data-lpignore="true" />
          </div>
          <div className='fail-message'>
          {inputEmail.length > 0 && !isEmail && <span>이메일 형식에 맞게 입력해주세요!</span>}
          </div>
          </div>
          <div className='addrContainer' id='popupDom'>
              <div>
              <div className='AddrBtn'>
                <button className="btn btn--primary" type='button' onClick={openPostCode}>Address</button>
              {isOpen && (
                <>
                  <button className='btn btn--primary' onClick={closePostCode} type='button'>닫기</button>
                  <PopupDom>
                    <DaumPostcode style={postCodeStyle} onComplete={handlePostCode} />
                  </PopupDom>
                </>
              )}
              </div>  
              <div className='inputContainer'>
                <input type='text' readOnly placeholder='선택된 주소' value={fullAddress}  />
                <input type='text' value={address} onChange={onChangeAddress} onSubmit={onKeyPress} placeholder='상세 주소 입력'/>
              </div>
              </div>
          </div>
          <div>
          </div>
            <div className="btn-group" ><button style={{width : '402px', height : '52px', padding : '12px', fontSize : '20px' }} className="btn btn--primary" type='button' disabled={submit} onClick={onClickSign}>Sign in</button></div>
          </div>
      </form>
    </div>
    </SignWrap>
  )
}

export default Sign;

