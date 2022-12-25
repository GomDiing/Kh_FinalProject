import { useEffect, useState } from "react";
import styled from "styled-components";
import { DaumPostcodeEmbed } from "react-daum-postcode";
import PopupDom from "../../SignPage/PopupDom";
import { useNavigate } from "react-router-dom";
import MemberApi from "../../../../api/MemberApi";
import { useSelector } from "react-redux";


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
  // display: "block",
  position: "absolute",
  top : "16%",
  left : "42%",
  width: "500px",
  height: "500px",
  // padding: "7px",
};

const InfoUpdate = () => {
  const userInfo = useSelector((state) => state.user.info)

  const [inputId, setInputId] = useState('');
  const [inputPwd, setInputPwd] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isOpen, setIsOpen] = useState(false);

    // 주소 
    let [fullAddress, setFullAddress] = useState('');
    // 도로명 주소
    const [road, setRoad] = useState("");
    // 지번 주소
    const [jibun, setJibun] = useState("");
    // 우편 번호
    const [postCode, setPostCode] = useState("");

    useEffect(() => {
      if(userInfo.userProvider_type === 'HOME') {
        getInfo();
      } else if(userInfo.userProvider_type === 'KAKAO' || 'GOOGLE') { 
        getInfo2();
      }
    },[userInfo.userProvider_type])

    const getInfo = async() => {
      try {
        const res = await MemberApi.searchId(userInfo.userId, userInfo.userProvider_type);
        if(res.data.statusCode === 200) {
          setInputId(res.data.results.id);
          setInputPwd(res.data.results.pwd);
          setInputName(res.data.results.name);
          setInputEmail(res.data.results.email);
          setFullAddress(res.data.results.road);
          setAddress(res.data.results.detail);
          setRoad(res.data.results.road);
          setJibun(res.data.results.jibun);
          setPostCode(res.data.results.zipcode);
          console.log(res.data);
          console.log(res.data);
        }
      } catch (e) {
        console.log(e);
      }
    };
  
    const getInfo2 = async() => {
      try {
        const res = await MemberApi.searchId2(userInfo.userEmail, userInfo.userProvider_type);
        if(res.data.statusCode === 200) {
          setInputId(res.data.results.id);
          setInputPwd(res.data.results.pwd);
          setInputName(res.data.results.name);
          setInputEmail(res.data.results.email);
          setFullAddress(res.data.results.road);
          setAddress(res.data.results.detail);
          setRoad(res.data.results.road);
          setJibun(res.data.results.jibun);
          setPostCode(res.data.results.zipcode);
          console.log(res.data);
          console.log(res.data);
        }
      } catch (e) {
        console.log(e);
      }
    }

    console.log(fullAddress);
    console.log(inputName);

  const onChangePwd = e => setInputPwd(e.target.value);
  const onChangeName = e => setInputName(e.target.value);
  const onChangeEmail = e => setInputEmail(e.target.value);
  const onChangeAddress = e => setAddress(e.target.value);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handlePostCode = (data) => {
    setFullAddress(data.address);
    setRoad(data.roadAddress);
    setJibun(data.jibunAddress);
    setPostCode(data.zonecode);
    setIsOpen(false);
    data.preventDefault();
  }

  const Navigate = useNavigate();

  console.log(inputId);
  console.log(inputPwd);
  console.log(inputName);
  console.log(inputEmail);
  console.log(road);
  console.log(jibun);
  console.log(address);
  console.log(postCode);

  const onClickChange = async (e) => {
    try {
      const response = await MemberApi.memberUpdate(inputId, inputPwd, inputName, inputEmail, road, jibun, address, postCode, userInfo.userProvider_type);
      if(response.data.statusCode === 200) {
      alert("회원정보 변경 완료");
    } Navigate(0);
    } catch (e) {
      if(e.response.data.results.statusCode === 400){
        alert("회원 정보가 올바르게 입력되지 않았습니다.")
        console.log(e.response.data.results)
      }else{
        console.log(e)
      }
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
          <input type='address' readOnly value={fullAddress}/>
          
          {isOpen ? 
          <button className='btn btn--primary' style={{alignItem: 'center'}} onClick={onClose} type='button'>닫기</button>
          :  
          <span><button onClick={onOpen}>주소 검색</button></span>
        }
            
          <br/>
          <div id='popupDom'>
            {isOpen && (
              <div>
                <PopupDom>
                  <DaumPostcodeEmbed style={postCodeStyle} onComplete={handlePostCode} />
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