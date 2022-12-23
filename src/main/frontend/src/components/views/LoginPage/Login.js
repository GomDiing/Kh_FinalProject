import React, { useState } from 'react'
import styled from 'styled-components';
import { GOOGLE_URL, KAKAO_AUTH_URL } from '../../Config';
import FindModal from './FindModal';
import MemberApi from '../../../api/MemberApi';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginActions } from '../../../util/Redux/Slice/userSlice';

const LoginWrap = styled.div`
  width: 100%;
  min-width: 930px;
  background-color: #d2d2d2;
  .loginwrap{
    min-height: 100vh;
    margin: 0 auto;
    width: 70%;
    background-color: #f5f5f5;
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
  .btn-group2{
    margin: 10px 0;
    display: flex;
    justify-content: center;
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
    color: black;
    background-color : #86868b;
  }
  @media (max-width : 1024px){
    .loginwrap{
      width: 100%;
    }
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
        }
      } catch (e) {
        if(e.response.data.statusCode === 400){
          setIsShowId(false);
          alert('조회 가능한 회원이 없습니다.');
        }else{
          console.log(e.response);
          console.log('통신 오류...')
        }
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
        }
      } catch (e) {
        if(e.response.data.results.statusCode === 400){
          setIsShowPwd(false);
          alert('조회 가능한 회원이 없습니다.');  
        }else {
          console.log(e);
          console.log('통신 오류...')
        }
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
    const KakaoLogin = () => {
        window.location.href = KAKAO_AUTH_URL;
      }
    // 구글 로그인
      const GoogleLogin = () => {
        window.location.href = GOOGLE_URL;
      }


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
    const navigate = useNavigate();

      // 모달 띄우기
    const [open, setOpen] = useState(false);
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);

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

    const [message, setMessage] = useState('');
    const [color, setColor] = useState('');
    const [type, setType] = useState('ACTIVE');

    // 리덕스 dispatch 리덕스에 값을 저장할때 사용
    const dispatch = useDispatch('');

    const LoginModalBody = () => {
      return(
        <div>
          <small style={{fontWeight: 'bold', color : color}}>{message}</small>
        </div>
      );
    }
    const onClickDeleteCancel = async () => {
      const response = await MemberApi.deleteCancel(inputId, inputPwd);
      if(response.data.statusCode === 200) {
        alert('탈퇴신청이 정상 취소 되었습니다.');
        setOpen(false);
        navigate('/');
      } else {
        console.log('error...');
        alert('이미 탈퇴신청이 완료..');
      }
    }

    const providerType = "HOME";

    const onClickLogin = async () => {
      try {
        const response = await MemberApi.login(inputId, inputPwd, providerType);
        if(response.data.statusCode === 200) {
          console.log(response.data)
          switch(response.data.results.status) {
            case "ACTIVE" :
              
            const data = {
                userIndex : response.data.results.index,
                userId : response.data.results.id,
                userPoint : response.data.results.point,
                userName : response.data.results.name,
                userEmail : response.data.results.email,
                userProvider_type : response.data.results.provider_type
              }
              dispatch(loginActions.setUserInfo({data}));
              navigate('/');
              break;
            case "DELETE" :
              setColor('green');
              setMessage('탈퇴신청을 하신 회원입니다 다시 처리를 취소하려면 확인을 누르시면 됩니다.');
              setOpen(true);
              setType('DELETE');
              break;
            case "UNREGISTER" :
              setColor('silver');
              setMessage('회원님은 탈퇴하신지 1주일이 지나 영구탈퇴가 되었습니다.');
              setOpen(true);
              break;
            case "BLACKLIST" :
              setColor('red');
              setMessage('당신은 이러이러한 이유로 인해 저희 사이트 블랙리스트 대상입니다.');
              setOpen(true);
              break;
            default : 
              alert('누구냐 넌..');
              break;
          }
        }
      } catch(e) {
        setLogin(true);
        console.log(e);
        console.log('오류');
      }
    }

    const onKeyPress = e => {
      if(e.key === "Enter") {
          onClickLogin();
      }
  }

  return (
  <>
    <LoginWrap>
      <div className='loginwrap'>
        <div className='a'>
          <div>
            <div className='loginHead'>
              <a href='/'><img src='images/TCat.jpg' alt=''></img></a>
            </div>
            <div className='loginHead'>
              <h2>User Login</h2>
            </div>
          </div>
          <form className="form" onsubmit="return false" autocomplete="off">
            <div className='logincontent'>
              <label for="login-username">Username</label>
                <div className="input-group">
                  <input type="text" value={inputId} onChange={onChangeId} id="login-username" data-lpignore="true" />
                </div>
              <label for="login-password">Password</label>
                <div className="input-group">
                  <input type="password" onKeyPress={onKeyPress} value={inputPwd} onChange={onChangePwd} id="login-password" data-lpignore="true" />
                </div>
              </div>
              <div className="btn-group">
                <button className="submitbtn" type='button' onClick={onClickLogin}>LOGIN</button>
              </div>
              {login === true && <span>아이디 또는 비밀번호가 일치하지 않습니다. 다시 확인해주세요</span>}
                <div className='btn-group'>
                  <img src='/images/kakao.png' alt='카카오 로그인' onClick={KakaoLogin}/>
                </div>
                <div className='btn-group'>
                  <img src={process.env.PUBLIC_URL + '/images/google.png'} alt='구글 로그인' onClick={GoogleLogin}/>
                </div>
                <div className='btn-group2' style={{marginTop : '40px'}}>
                  <Link to = '/agree' style={{textDecoration:'none',color:'inherit' }}>
                  <p className="btn--text">Sign Up</p>
                  </Link>
                </div>
                <div className='btn-group2'>
                  <p className="btn--text" id='id' onClick={openModal}>Forgot id?</p>
                </div>
                <div className='btn-group2'>
                  <p className="btn--text" id='pwd' onClick={openModal}>Forgot password?</p>
                </div>
              </form>
            </div>
          </div>
        </LoginWrap>
        {open && <FindModal open={onOpen} deleteCancel={onClickDeleteCancel} close={onClose} type={type} body={<LoginModalBody />} />}
        {modalOpen &&<FindModalList topics={topics} />}
    </>
    );
  }

export default Login;