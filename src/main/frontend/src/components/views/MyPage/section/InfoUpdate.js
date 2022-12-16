import { useState } from "react";
import styled from "styled-components";
import { DaumPostcodeEmbed } from "react-daum-postcode";
import PopupDom from "../../SignPage/PopupDom";
import { useNavigate } from "react-router-dom";
import MemberApi from "../../../../api/MemberApi";


const InfoStyle = styled.div`
  margin: 0 auto;
  box-sizing: border-box;
  .info-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
  }
  input {
    width: 200px;
    height: 30px;
    border: 1px solid silver;
    border-radius: 10rem;
  }
  input:focus {
    background-color: #232323;
    color: #fff;
    border: 2px solid black;
  }
  button {
    margin-top: .75rem;
    border: none;
    border-radius: 10rem;
    width: 120px;
    height: 40px;
    background-color: #232323;
    color: silver;
    margin-top: 20px;
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

const InfoUpdate = (props) => {
  console.log(props.id);
  console.log(props.name);
  console.log(props.pwd);
  console.log(props.email);
  console.log(props.road);
  console.log(props.detail);


  const [inputId, setInputId] = useState(props.id);
  const [inputPwd, setInputPwd] = useState(props.pwd);
  const [inputName, setInputName] = useState(props.name);
  const [inputEmail, setInputEmail] = useState(props.email);
  const [address, setAddress] = useState(props.detail);
  const [isOpen, setIsOpen] = useState(false);

    // 주소 
    let [fullAddress, setFullAddress] = useState(props.road);

    // 도로명 주소
    const [road, setRoad] = useState("");
    // 지번 주소
    const [jibun, setJibun] = useState("");
  
    // 우편 번호
    const [postCode, setPostCode] = useState("");

  const onChangePwd = e => setInputPwd(e.target.value);
  const onChangeName = e => setInputName(e.target.value);
  const onChangeEmail = e => setInputEmail(e.target.value);
  const onChangeAddress = e => setAddress(e.target.value);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handlePostCode = (data) => {
    setFullAddress(data.address);
    console.log(data.address);
    console.log(data.roadAddress);
    console.log(data.jibunAddress);
    console.log(data.zonecode);

    setRoad(data.roadAddress);
    setJibun(data.jibunAddress);
    setPostCode(data.zonecode);
    data.preventDefault();
  }

  const Navigate = useNavigate();


  const onClickChange = async () => {
    try {
      const memberUpdate = await MemberApi.memberUpdate(inputId, inputPwd, inputName, inputEmail, road, jibun, address, postCode)
      if(memberUpdate.data.statusCode === 200) {
      alert("회원정보 변경 완료");
    } Navigate('/Mypage');
    } catch (e) {
      alert("젠장");
    }
  }


  return(
    <InfoStyle>
      <div className="info-container">
        <h3>회원 정보 업데이트</h3>
        <label>아이디</label>
          <input type='text' value={inputId} readOnly/>
        <label>비밀번호</label>
          <input type='password' value={inputPwd} onChange={onChangePwd}/>
        <label>이름</label>
          <input type='name' value={inputName} onChange={onChangeName} />
        <label>이메일</label>
          <input type='email' value={inputEmail} onChange={onChangeEmail} />
        <label>주소</label>
          <input type='address' readOnly placeholder={fullAddress} value={fullAddress}/><span><button onClick={onOpen}>주소 검색</button></span>
          <div id='popupDom'>
            {isOpen && (
              <div>
                <PopupDom>
                  <DaumPostcodeEmbed style={postCodeStyle} onComplete={handlePostCode} />
                  <button className='btn btn--primary' style={{alignItem: 'center'}} onClick={onClose} type='button'>닫기</button>
                </PopupDom>
              </div>
              )}
          </div>
          <input type='text' value={address} onChange={onChangeAddress} placeholder='상세 주소 입력'/>
        <button onClick={onClickChange}>변경 확인</button>
      </div>
    </InfoStyle>
  )
}

export default InfoUpdate;