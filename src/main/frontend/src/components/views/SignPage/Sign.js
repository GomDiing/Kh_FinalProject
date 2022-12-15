import React, { useState } from 'react';
import styled from 'styled-components';
import PopupDom from './PopupDom';
import DaumPostcode from "react-daum-postcode";
import MemberApi from '../../../api/MemberApi';
import { useNavigate } from 'react-router-dom';

const SignWrap = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #d2d2d2;
  .signwrap{
    margin: 0 auto;
    width: 50%;
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
  h2{
    margin: 0 auto;
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
    /* justify-content: center; */
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
    /* display: inline-block; */
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

  // 상세 주소 값
  const [address, setAddress] = useState("");
  // 우편 번호
  const [postCode, setPostCode] = useState("");
  // 지번, 도로명 구분
  let [type, setType] = useState("");
  // 팝업 열기
  const openPostCode = () => setIsOpen(true);
  // 팝업 닫기
  const closePostCode = () => setIsOpen(false);
  // 값 담기
  const onChangeAddress = e => setAddress(e.target.value);

  /**
   * 
   * @param {Address..} data 
   */
  const handlePostCode = (data) => {
    setFullAddress(data.address);
    // 우편번호
    setPostCode(data.zonecode);

    console.log(isOpen);
    setIsOpen(false);
    data.preventDefualt();
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
  
  const onClickSign = e => {
    if(isId && isPwd && isCheck && isName && isEmail) {
      setSubmit(true);
      alert('회원가입을 축하드립니다.');
      e.preventDefualt();
    } else {
      console.log(isId)
      console.log(isPwd)
      console.log(isCheck)
      console.log(isName)
      console.log(isEmail)
      setSubmit(false);
      alert('회원가입 실패 다시 확인 부탁드립니다.');
      e.preventDefualt();
    }
  }


  return (
    <SignWrap>
    <div className='signwrap'>
      <form className="form">
      <div className="form-inner">
        <div>
          <div className='signupHead'>
            <a href='/'><img src='images/TCat.jpg'></img></a>
          </div>
          <div className='signupHead'>
            <h2>Sign Up</h2>
          </div>
        </div>
          <div className="input-wrapper">
            <label for="sign-username">Username</label>
              <div className="input-group"><span className="icon"><svg viewBox="0 0 24 24">
                      <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"></path>
                      </svg></span><input type="text" value={inputId} id="sign-username" onChange={onChangeId} data-lpignore="true" />
              </div>
          </div>
          <div className="input-wrapper">
            <label for="sign-password">Password</label>
              <div className="input-group"><span className="icon"><svg viewBox="0 0 24 24">
                      <path d="M11.83,1.73C8.43,1.79 6.23,3.32 6.23,3.32C5.95,3.5 5.88,3.91 6.07,4.19C6.27,4.5 6.66,4.55 6.96,4.34C6.96,4.34 11.27,1.15 17.46,4.38C17.75,4.55 18.14,4.45 18.31,4.15C18.5,3.85 18.37,3.47 18.03,3.28C16.36,2.4 14.78,1.96 13.36,1.8C12.83,1.74 12.32,1.72 11.83,1.73M12.22,4.34C6.26,4.26 3.41,9.05 3.41,9.05C3.22,9.34 3.3,9.72 3.58,9.91C3.87,10.1 4.26,10 4.5,9.68C4.5,9.68 6.92,5.5 12.2,5.59C17.5,5.66 19.82,9.65 19.82,9.65C20,9.94 20.38,10.04 20.68,9.87C21,9.69 21.07,9.31 20.9,9C20.9,9 18.15,4.42 12.22,4.34M11.5,6.82C9.82,6.94 8.21,7.55 7,8.56C4.62,10.53 3.1,14.14 4.77,19C4.88,19.33 5.24,19.5 5.57,19.39C5.89,19.28 6.07,18.92 5.95,18.6V18.6C4.41,14.13 5.78,11.2 7.8,9.5C9.77,7.89 13.25,7.5 15.84,9.1C17.11,9.9 18.1,11.28 18.6,12.64C19.11,14 19.08,15.32 18.67,15.94C18.25,16.59 17.4,16.83 16.65,16.64C15.9,16.45 15.29,15.91 15.26,14.77C15.23,13.06 13.89,12 12.5,11.84C11.16,11.68 9.61,12.4 9.21,14C8.45,16.92 10.36,21.07 14.78,22.45C15.11,22.55 15.46,22.37 15.57,22.04C15.67,21.71 15.5,21.35 15.15,21.25C11.32,20.06 9.87,16.43 10.42,14.29C10.66,13.33 11.5,13 12.38,13.08C13.25,13.18 14,13.7 14,14.79C14.05,16.43 15.12,17.54 16.34,17.85C17.56,18.16 18.97,17.77 19.72,16.62C20.5,15.45 20.37,13.8 19.78,12.21C19.18,10.61 18.07,9.03 16.5,8.04C14.96,7.08 13.19,6.7 11.5,6.82M11.86,9.25V9.26C10.08,9.32 8.3,10.24 7.28,12.18C5.96,14.67 6.56,17.21 7.44,19.04C8.33,20.88 9.54,22.1 9.54,22.1C9.78,22.35 10.17,22.35 10.42,22.11C10.67,21.87 10.67,21.5 10.43,21.23C10.43,21.23 9.36,20.13 8.57,18.5C7.78,16.87 7.3,14.81 8.38,12.77C9.5,10.67 11.5,10.16 13.26,10.67C15.04,11.19 16.53,12.74 16.5,15.03C16.46,15.38 16.71,15.68 17.06,15.7C17.4,15.73 17.7,15.47 17.73,15.06C17.79,12.2 15.87,10.13 13.61,9.47C13.04,9.31 12.45,9.23 11.86,9.25M12.08,14.25C11.73,14.26 11.46,14.55 11.47,14.89C11.47,14.89 11.5,16.37 12.31,17.8C13.15,19.23 14.93,20.59 18.03,20.3C18.37,20.28 18.64,20 18.62,19.64C18.6,19.29 18.3,19.03 17.91,19.06C15.19,19.31 14.04,18.28 13.39,17.17C12.74,16.07 12.72,14.88 12.72,14.88C12.72,14.53 12.44,14.25 12.08,14.25Z"></path>
                      </svg></span><input type="password" value={inputPwd} id="sign-password" onChange={onChangePwd} data-lpignore="true" />
          </div>
          </div>
          <div className="input-wrapper">
            <label for="sign-password-check">Password check</label>
              <div className="input-group"><span className="icon"><svg viewBox="0 0 24 24">
                      <path d="M11.83,1.73C8.43,1.79 6.23,3.32 6.23,3.32C5.95,3.5 5.88,3.91 6.07,4.19C6.27,4.5 6.66,4.55 6.96,4.34C6.96,4.34 11.27,1.15 17.46,4.38C17.75,4.55 18.14,4.45 18.31,4.15C18.5,3.85 18.37,3.47 18.03,3.28C16.36,2.4 14.78,1.96 13.36,1.8C12.83,1.74 12.32,1.72 11.83,1.73M12.22,4.34C6.26,4.26 3.41,9.05 3.41,9.05C3.22,9.34 3.3,9.72 3.58,9.91C3.87,10.1 4.26,10 4.5,9.68C4.5,9.68 6.92,5.5 12.2,5.59C17.5,5.66 19.82,9.65 19.82,9.65C20,9.94 20.38,10.04 20.68,9.87C21,9.69 21.07,9.31 20.9,9C20.9,9 18.15,4.42 12.22,4.34M11.5,6.82C9.82,6.94 8.21,7.55 7,8.56C4.62,10.53 3.1,14.14 4.77,19C4.88,19.33 5.24,19.5 5.57,19.39C5.89,19.28 6.07,18.92 5.95,18.6V18.6C4.41,14.13 5.78,11.2 7.8,9.5C9.77,7.89 13.25,7.5 15.84,9.1C17.11,9.9 18.1,11.28 18.6,12.64C19.11,14 19.08,15.32 18.67,15.94C18.25,16.59 17.4,16.83 16.65,16.64C15.9,16.45 15.29,15.91 15.26,14.77C15.23,13.06 13.89,12 12.5,11.84C11.16,11.68 9.61,12.4 9.21,14C8.45,16.92 10.36,21.07 14.78,22.45C15.11,22.55 15.46,22.37 15.57,22.04C15.67,21.71 15.5,21.35 15.15,21.25C11.32,20.06 9.87,16.43 10.42,14.29C10.66,13.33 11.5,13 12.38,13.08C13.25,13.18 14,13.7 14,14.79C14.05,16.43 15.12,17.54 16.34,17.85C17.56,18.16 18.97,17.77 19.72,16.62C20.5,15.45 20.37,13.8 19.78,12.21C19.18,10.61 18.07,9.03 16.5,8.04C14.96,7.08 13.19,6.7 11.5,6.82M11.86,9.25V9.26C10.08,9.32 8.3,10.24 7.28,12.18C5.96,14.67 6.56,17.21 7.44,19.04C8.33,20.88 9.54,22.1 9.54,22.1C9.78,22.35 10.17,22.35 10.42,22.11C10.67,21.87 10.67,21.5 10.43,21.23C10.43,21.23 9.36,20.13 8.57,18.5C7.78,16.87 7.3,14.81 8.38,12.77C9.5,10.67 11.5,10.16 13.26,10.67C15.04,11.19 16.53,12.74 16.5,15.03C16.46,15.38 16.71,15.68 17.06,15.7C17.4,15.73 17.7,15.47 17.73,15.06C17.79,12.2 15.87,10.13 13.61,9.47C13.04,9.31 12.45,9.23 11.86,9.25M12.08,14.25C11.73,14.26 11.46,14.55 11.47,14.89C11.47,14.89 11.5,16.37 12.31,17.8C13.15,19.23 14.93,20.59 18.03,20.3C18.37,20.28 18.64,20 18.62,19.64C18.6,19.29 18.3,19.03 17.91,19.06C15.19,19.31 14.04,18.28 13.39,17.17C12.74,16.07 12.72,14.88 12.72,14.88C12.72,14.53 12.44,14.25 12.08,14.25Z"></path>
                      </svg></span><input type="password" value={pwdCheck} id="sign-password-check" onChange={onChangePwdCheck} data-lpignore="true" />
          </div>
          </div>

          <div className="input-wrapper">
            <label for="sign-name">Name</label>
              <div className="input-group"><span className="icon"><svg viewBox="0 0 501.333 501.333">
                    <path d="M455.466,49.6h-409.6C20.267,49.6,0,69.867,0,95.466v310.4c0,25.6,20.267,45.867,45.867,45.867h409.6 c25.6,0,45.867-21.333,45.867-45.867v-310.4C501.333,69.867,481.066,49.6,455.466,49.6z M430.933,91.2L250.666,252.267 L71.466,91.2H430.933z M459.733,405.867c0,2.133-2.133,4.267-4.266,4.267h-409.6c-2.133,0-4.267-2.133-4.267-4.267V122.133 L236.8,296c4.267,3.2,8.533,5.333,13.867,5.333c5.333,0,9.6-2.133,13.867-5.333l195.2-173.867V405.867z"/>
                    </svg></span><input type="text" value={inputName} id="sign-name" onChange={onChangeName} data-lpignore="true" />
          </div>
          </div>

          <div className="input-wrapper">
            <label for="sign-email">EMAIL</label>
              <div className="input-group"><span className="icon"><svg viewBox="0 0 501.333 501.333">
              <path d="M455.466,49.6h-409.6C20.267,49.6,0,69.867,0,95.466v310.4c0,25.6,20.267,45.867,45.867,45.867h409.6 c25.6,0,45.867-21.333,45.867-45.867v-310.4C501.333,69.867,481.066,49.6,455.466,49.6z M430.933,91.2L250.666,252.267 L71.466,91.2H430.933z M459.733,405.867c0,2.133-2.133,4.267-4.266,4.267h-409.6c-2.133,0-4.267-2.133-4.267-4.267V122.133 L236.8,296c4.267,3.2,8.533,5.333,13.867,5.333c5.333,0,9.6-2.133,13.867-5.333l195.2-173.867V405.867z"/>
              </svg></span><input type="email" id="sign-email" value={inputEmail} onChange={onChangeEmail} data-lpignore="true" />
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
                {/* <p /> */}
                <input type='text' value={address} onChange={onChangeAddress} placeholder='상세 주소 입력'/>
              </div>
              </div>
          </div>
          <div>
          </div>
            <div className="btn-group" ><button style={{width : '402px' , height : '52px', padding : '12px' , fontSize : '20px'}} className="btn btn--primary" type='button' disabled={submit} onClick={onClickSign}>Sign in</button></div>
          </div>
      </form>
    </div>
    </SignWrap>
  )
}

export default Sign;

