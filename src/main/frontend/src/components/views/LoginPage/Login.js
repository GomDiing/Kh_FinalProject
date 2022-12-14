import React, { useState } from 'react'
import styled from 'styled-components';
import { KAKAO_AUTH_URL } from '../../Config';
import FindModal from './FindModal';
import MemberApi from '../../../api/MemberApi';

const LoginWrap = styled.div`
  width: 100%;
  background-color: #f5f5f5;
  height: 100vh;
  .loginwrap{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .logincontent{
    margin-top: 40px;
  }
  h2{
    margin: 0 auto;
  }
  .loginHead{
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
    justify-content: center;
    margin: 20px 0;
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
  input:hover{
    /* background-color: #86868b; */
  } 
  button:hover{
    background-color : #86868b;
  }

`
const IdStyle = styled.div`
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
  }
  .show-00 {
    width: 300px;
    height: 30px;
    text-align: center;
    border-radius: 3rem;
  }
  .modal-input {
    width: 200px;
    margin-top: 3px;
    padding: 3px;
    border: 1px solid brown;
    border-radius: 12rem;
  }
  .modal-input:focus {
    border: 1px solid silver;
  }
  .check-button {
    padding: 6px 12px;
    color: #fff;
    background-color: #6c757d;
    border-radius: 5px;
    font-size: 13px;
  }
`;


  const FindIdHeader = () => {
    return(
      <h4 style={{textAlign: 'center'}}>아이디 찾기</h4>
    );
  }

  const FindPwdHeader = () => {
    return(
      <h4 style={{textAlign: 'center'}}>비밀번호 찾기</h4>
    );
  }

  const FindIdBody = () => {
    const [inputName, setInputName] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [isShowId, setIsShowId] = useState(false);
    const [memberId, setMemberId] = useState('');
  
    const onChangeName = e => setInputName(e.target.value);
    const onChangeEmail = e => setInputEmail(e.target.value);
  
    const onClickCheck = async () => {
      try{
        const result = await MemberApi.findId(inputName, inputEmail);
        if(result.data.statusCode === 200) {
          setMemberId(result.data.results.member_id);
          setIsShowId(true);
        } else {
          setIsShowId(false);
          alert('다시 확인해주세요.');
        }
      } catch (e) {
        console.log(e);
        console.log('통신 오류...')
      }
    }
  
    return(
      <IdStyle>
        <div className='container'>
          <label name='name'>이름</label>
          <input value={inputName} onChange={onChangeName} className='modal-input' name='name' type='text' />
            <p />
          <label name='email'>이메일</label>
          <input value={inputEmail} onChange={onChangeEmail} className='modal-input' name='email' type='email' />
            <p />
            {isShowId ? <></> : <button className='check-button' onClick={onClickCheck}>확인</button>}
            {isShowId &&
            <div className='show-00'>
              <small>{inputName}님의 아이디는<br /> <u><span style={{fontWeight: 'bold', color: '#232323'}}>{memberId}</span></u>입니다.</small>
            </div>}
          </div>
    </IdStyle>
    );
  }

  const FindPwdBody = () => {
    const [inputId, setInputId] = useState('');
    const [inputName, setInputName] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [isShowPwd, setIsShowPwd] = useState(false);
    const [password, setPassword] = useState('');

    const onChangeId = e => setInputId(e.target.value);
    const onChangeName = e => setInputName(e.target.value);
    const onChangeEmail = e => setInputEmail(e.target.value);

    const onClickCheck = async () => {
      try{
        const result = await MemberApi.findPassword(inputId, inputName, inputEmail);
        if(result.data.statusCode === 200) {
          setPassword(result.data.results.password);
          setIsShowPwd(true);
        } else {
          setIsShowPwd(false);
          alert('다시 확인해주세요.');
        }
      } catch (e) {
        console.log(e);
        console.log('통신 오류...')
      }
    }

    return(
      <IdStyle>
        <div className='container'>
          <label name='id'>아이디 입력 </label>
          <input value={inputId} onChange={onChangeId} className='modal-input' name='id'  type='text' />
            <p />
          <label name='name'>이름 입력 </label>
          <input value={inputName} onChange={onChangeName} className='modal-input' name='name' type='text' />
            <p />
          <label name='email'>이메일 입력 </label>
          <input value={inputEmail} onChange={onChangeEmail} className='modal-input'name='email'  type='email' />
            <p />
            {isShowPwd ? <></> : <button className='check-button' onClick={onClickCheck}>확인</button>}
              {isShowPwd &&
              <div className='show-00'>
                <small>{inputName}님의 아이디는<br /> <u><span style={{fontWeight: 'bold', color: '#232323'}}>{password}</span></u>입니다.</small>
              </div>}
        </div>
      </IdStyle>
    );
  }

function Login() {
// 카카오 로그인
const handleLogin = () => {
window.location.href = KAKAO_AUTH_URL;
};

const [modalOpen, setModalOpen] = useState(false);
const [id, setId] = useState(1);
const openModal = e => {
setModalOpen(true);
let test = e.target.id;
if(test === 'id') {
  setId(1);
} else if(test === 'pwd') {
  setId(2);
}
}
const closeModal = () => setModalOpen(false);

const [inputId, setInputId] = useState("");
const [inputPwd, setInputPwd] = useState("");
const [login, setLogin] = useState(false);

const onChangeId = e => setInputId(e.target.value);
const onChangePwd = e => setInputPwd(e.target.value);

const topics = [
{id:1, title: <FindModal open={openModal} close={closeModal} header={<FindIdHeader />} body={<FindIdBody />}/>},
{id:2, title:<FindModal open={openModal} close={closeModal} header={<FindPwdHeader />} body={<FindPwdBody />}/>},
];

const FindModalList = props => {
const t = [...props.topics];
    return(
        <>
        {t && t.map((list) => (
            <div key={list.id}>
                {list.id === id && modalOpen && list.title}
            </div>
        ))}
        </>
    );
}

return (
<>
<LoginWrap>
<div className='loginwrap'>
  <div className='a'>
    <div>
      <div className='loginHead'>
        <a href='/'><img src='images/TCat.jpg'></img></a>
      </div>
      <div className='loginHead'>
        <h2>User Login</h2>
      </div>
    </div>
    <form className="form" onsubmit="return false" autocomplete="off">
        <div className='logincontent'>
            <label for="login-username">Username</label>
              <div className="input-group"><span className="icon"><svg viewBox="0 0 24 24">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"></path>
                </svg></span><input type="text" value={inputId} onChange={onChangeId} id="login-username" data-lpignore="true" />
              </div>
            <label for="login-password">Password</label>
              <div className="input-group"><span className="icon"><svg viewBox="0 0 24 24">
                <path d="M11.83,1.73C8.43,1.79 6.23,3.32 6.23,3.32C5.95,3.5 5.88,3.91 6.07,4.19C6.27,4.5 6.66,4.55 6.96,4.34C6.96,4.34 11.27,1.15 17.46,4.38C17.75,4.55 18.14,4.45 18.31,4.15C18.5,3.85 18.37,3.47 18.03,3.28C16.36,2.4 14.78,1.96 13.36,1.8C12.83,1.74 12.32,1.72 11.83,1.73M12.22,4.34C6.26,4.26 3.41,9.05 3.41,9.05C3.22,9.34 3.3,9.72 3.58,9.91C3.87,10.1 4.26,10 4.5,9.68C4.5,9.68 6.92,5.5 12.2,5.59C17.5,5.66 19.82,9.65 19.82,9.65C20,9.94 20.38,10.04 20.68,9.87C21,9.69 21.07,9.31 20.9,9C20.9,9 18.15,4.42 12.22,4.34M11.5,6.82C9.82,6.94 8.21,7.55 7,8.56C4.62,10.53 3.1,14.14 4.77,19C4.88,19.33 5.24,19.5 5.57,19.39C5.89,19.28 6.07,18.92 5.95,18.6V18.6C4.41,14.13 5.78,11.2 7.8,9.5C9.77,7.89 13.25,7.5 15.84,9.1C17.11,9.9 18.1,11.28 18.6,12.64C19.11,14 19.08,15.32 18.67,15.94C18.25,16.59 17.4,16.83 16.65,16.64C15.9,16.45 15.29,15.91 15.26,14.77C15.23,13.06 13.89,12 12.5,11.84C11.16,11.68 9.61,12.4 9.21,14C8.45,16.92 10.36,21.07 14.78,22.45C15.11,22.55 15.46,22.37 15.57,22.04C15.67,21.71 15.5,21.35 15.15,21.25C11.32,20.06 9.87,16.43 10.42,14.29C10.66,13.33 11.5,13 12.38,13.08C13.25,13.18 14,13.7 14,14.79C14.05,16.43 15.12,17.54 16.34,17.85C17.56,18.16 18.97,17.77 19.72,16.62C20.5,15.45 20.37,13.8 19.78,12.21C19.18,10.61 18.07,9.03 16.5,8.04C14.96,7.08 13.19,6.7 11.5,6.82M11.86,9.25V9.26C10.08,9.32 8.3,10.24 7.28,12.18C5.96,14.67 6.56,17.21 7.44,19.04C8.33,20.88 9.54,22.1 9.54,22.1C9.78,22.35 10.17,22.35 10.42,22.11C10.67,21.87 10.67,21.5 10.43,21.23C10.43,21.23 9.36,20.13 8.57,18.5C7.78,16.87 7.3,14.81 8.38,12.77C9.5,10.67 11.5,10.16 13.26,10.67C15.04,11.19 16.53,12.74 16.5,15.03C16.46,15.38 16.71,15.68 17.06,15.7C17.4,15.73 17.7,15.47 17.73,15.06C17.79,12.2 15.87,10.13 13.61,9.47C13.04,9.31 12.45,9.23 11.86,9.25M12.08,14.25C11.73,14.26 11.46,14.55 11.47,14.89C11.47,14.89 11.5,16.37 12.31,17.8C13.15,19.23 14.93,20.59 18.03,20.3C18.37,20.28 18.64,20 18.62,19.64C18.6,19.29 18.3,19.03 17.91,19.06C15.19,19.31 14.04,18.28 13.39,17.17C12.74,16.07 12.72,14.88 12.72,14.88C12.72,14.53 12.44,14.25 12.08,14.25Z"></path>
                </svg></span><input type="password" value={inputPwd} onChange={onChangePwd} id="login-password" data-lpignore="true" />
              </div>
          </div>

          <div className="btn-group">
            <button className="submitbtn">LOGIN</button>
          </div>
          <div className='btn-group'>
          <img src='/images/test.png' alt='카카오 로그인' onClick={handleLogin}/>
          </div>
          <div className='btn-group'>
            <p className="btn--text" id='id' onClick={openModal}>Forgot id?</p>
          </div>
          <div className='btn-group'>
            <p className="btn--text" id='pwd' onClick={openModal}>Forgot password?</p>
          </div>
    </form>
  </div>
</div>
</LoginWrap>
{modalOpen &&<FindModalList topics={topics} />}
</>
)
}

export default Login;