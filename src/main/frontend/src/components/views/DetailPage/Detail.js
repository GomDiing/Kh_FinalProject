import React, { useEffect, useState } from 'react';
import {Layout} from 'antd';
import TCalendar from './Section/Side/TCalendar'
import Poster from './Section/Summary/Poster';
import Info from './Section/Summary/Info';
import DBody from './Section/Body/DBody';
import MainHeader from '../MainHeader/MainHeader';
import Footer from '../Footer/Footer';
import styled from 'styled-components';
import { BsArrowUpCircle } from 'react-icons/bs';
const { Content, Sider } = Layout;

const DWrap = styled.div`
width: 100%;
min-width: 970px;
background-color: #f5f5f5;
/* min-width: 1024px; */
/* border: 1px solid black; */
.topBtn {
  position: fixed; 
  opacity: 0; 
  bottom: 80px; 
  right: 55px;
  z-index: -10; 
  border: 0 none;
  background: none;
  cursor: pointer;
  transition: opacity 0.3s ease-in;
}
.arrow {
  font-size: 50px;
}
.topBtn.active {
  z-index: 10; 
  opacity: 1; 
}

.topBtn:hover,
.topBtn:focus,
.topBtn:active { 
  outline: 0 none; 
}
.detailSiderContainer{
  border-radius: 1.2rem;
  background-color: silver;
  overflow: auto;
  height: 650px;
  position: fixed; 
  left: 70%;
  top: 6.5rem;
  bottom: 0;
}
.ItemContainer2{
  width: 100%;
  display: flex;
}

@media (max-width: 1024px){
  
  .ItemContainer2{
    display: block;
  }
  .site-layout-background{
  }
  .detailSiderContainer{
    left: 500px;
    position: sticky;
  }

}
`

// 상세페이지
function Detail() {
  const item_name = '태양의서커스 <뉴 알레그리아>';
  const price = 150000;
  const [ScrollY, setScrollY] = useState(0);
  const [BtnStatus, setBtnStatus] = useState(false);
  
  const handleFollow = () => {
    setScrollY(window.pageYOffset);
    if(ScrollY > 100) {
      setBtnStatus(true);
    } else {
      setBtnStatus(false);
    }
  }

  const handleTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    setScrollY(0);
    setBtnStatus(false);
  }

  useEffect(() => {
    const watch = () => {
      window.addEventListener('scroll', handleFollow)
    }
    watch();
    return () => {
      window.removeEventListener('scroll', handleFollow)
    }
  })

  return (
    <DWrap>
      <button className={BtnStatus ? "topBtn active" : "topBtn"} onClick={handleTop}>
      <BsArrowUpCircle className='arrow'/>
        </button>
      <MainHeader/>
      <Layout style={{width: '80%', height: '100%' ,margin:'0 auto'}}>

        <Content >
          <Layout className="site-layout-background" >
            <div className='ItemContainer2'>
            <Content className='posterCon' style={{border:'1px solid blakc'}}>
              <Poster/>
            </Content>
            <hr style={{backgroundColor: 'black', width: '1px', opacity: '0.6'}} />


            <Content className='DetailInfoContainer' style={{width: '60%'}}>
              <Info/>
            </Content>
            </div>

            <Sider className="detailSiderContainer" width={310} >
              <TCalendar item_name={item_name} price={price}/>
            </Sider>
          </Layout>


          <Content>
              <DBody/>
          </Content>
        </Content>
        <Footer/>
      </Layout>
    </DWrap>
  )
}
  
export default Detail;