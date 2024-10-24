import styled from "styled-components";
import logoTCat from "../../../images/TCat.jpg"

const FooterContainer = styled.div`
  width: 100%;
  background-color: #f5f5f5;
  .ContentsContainer{
    display: flex;
    margin: 0 80px;
    justify-content: space-between;
  }
  
  li{
    list-style: none;
    margin:10px 0;
  }
  img{
    width: 150px;
    height: 100px;
    margin-right: 20px;
  }
  .box{
    display: flex;
    align-items: center;
    justify-content: center;
    /* margin: 0 150px; */
  }
  p{
    font-size: 0.9em;
    margin: 0;
    opacity: 70%;
  }
  h4{
    font-size: 1.5em;
    margin: 0;
    opacity: 80%;
  }
  hr{
    border: solid 1px black;
    width: 100%;
  }
  .Nav{
    width: 100%;
    margin: 0 80px;
    display: flex;
    justify-content: space-between;
    ul{
      padding: 0;
      text-align: center;
      font-size: 16px;
      margin: 0 20px;
    }
    li{
      margin: 5px 0;
      font-size: 14px;
      opacity: 80%;
    }
  }
  `

const Footer =()=> {
  return (
    <FooterContainer>
        <div className = "ContentsContainer"> 
          {/*<li><a>개인정보처리방침</a></li>*/}
          {/*<li><a>청소년보호정책</a></li> */}
          {/*<li><a>이용약관</a></li>*/}
          {/*<li><a>티켓판매안내</a></li>*/}
          {/*<li><a>회사소개</a></li>*/}
          {/*<li><a>제휴/광고안내</a></li>*/}
        </div>
        <div className="box">
        <div>
          <li><img src={logoTCat} alt=''></img></li>
        </div>
        <div className="TextBox">
          <div>
            <h4>Team T-Cat</h4>
            <p>하정목 김승렬 김성탁 박하린 지민</p>
            <p>주소 : 서울시 강남구 테헤란로 14길 6 kh 정보교육원</p>
            <p>Copyright 2022 T-Cat All rights reserved.</p>
          </div>
        </div>
        </div>
    </FooterContainer>

  )
}

export default Footer;