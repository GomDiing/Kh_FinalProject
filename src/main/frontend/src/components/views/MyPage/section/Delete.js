import Password from "antd/es/input/Password";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MemberApi from "../../../../api/MemberApi";

function Delete() {
  const userInfo = useSelector((state) => state.user.info);
  const navigate = useNavigate();
  const [inputPwd, setInputPwd] = useState('');
  const handleChangePassword = e => setInputPwd(e.target.value);
  const handelDeleteMember = async () => {
    if(userInfo.userProvider_type !== 'HOME') {
      alert('소셜 로그인은 회원가입이 불가능합니다.');
      navigate('/Mypage');
    } else {
      try {
        const res = await MemberApi.deleteMmeber(userInfo.userId, inputPwd, userInfo.userProvider_type);
        if(res.data.statusCode === 200) {
          alert('회원탈퇴 성공 ! ! !');
        } else {
          alert('회원님의 비밀번호가 일치하지 않습니다.');
          navigate('./');
        }
      } catch(e) {
        console.log('error ! ! !');
        console.log(e);
      }
    }
  }

  return(
    <div>
      <h4>정말 탈퇴 하시겠습니까?</h4>
      <ul>
        <li>탈퇴신청 시 1주일 뒤에 처리됩니다.</li>
        <li>1주일 이내 다시 로그인 할 경우 다시 복구신청이 가능합니다.</li>
        <li>탈퇴신청 1주일이 지나면 영구탈퇴가 되므로 주의바랍니다.</li>
      </ul>
      <div style={{display : 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <input style={{width : '300px', height: '40px'}} value={inputPwd} onChange={handleChangePassword} type='text' placeholder='패스워드를 입력 후 확인을 눌러주세요' />
        <button onClick={handelDeleteMember} type='button'>확인</button>
      </div>
    </div>
  ); 
}

export default Delete;