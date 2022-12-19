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
import DetailApi from '../../../api/DetailApi';
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
  height: 660px;
  position: fixed; 
  left: 70%;
  top: 6.5rem;
  bottom: 0;
}
.ItemContainer2{
  width: 100%;
  display: flex;
  background-color: white;
}

@media (max-width: 1225px){
  .ItemContainer2{
    display: block;
    min-width: 520px;
  }
  .posterCon {
    min-width: 520px;
  }
  .site-layout-background{
  }
  .detailSiderContainer{
    left: 500px;
    position: sticky;
  }
.info {
  margin-left: 4.8rem;
  min-width: 480px;
}
.poster-box-bottom {
  min-width: 520px;
}
}
`

// 상세페이지
function Detail() {
  const item_name = '태양의서커스 <뉴 알레그리아>';
  const price = 150000;
  const [ScrollY, setScrollY] = useState(0);
  const [BtnStatus, setBtnStatus] = useState(false);
  const [pCode, setPcode] = useState(22009226);
  const [comList, setComList] = useState([]);

  
  // 최상단 스크롤
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

  useEffect(() => {
    const getData = async()=> {
      try {
        const res = await DetailApi.getDetail(pCode);
        if(res.data.statusCode === 200){
          console.log(res.data.results);
          console.log(res.data.results.compact_list);
          setComList(res.data.results.compact_list);
        } else{
          alert("데이터 조회가 실패.")
        }
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, []);

  return (
    <DWrap>
      <button className={BtnStatus ? "topBtn active" : "topBtn"} onClick={handleTop}>
      <BsArrowUpCircle className='arrow'/>
        </button>
      <MainHeader/>
      <Layout style={{width: '80%', height: '100%' ,margin:'0 auto', backgroundColor: 'white'}}>
        <Content >
          <Layout className="site-layout-background" >
            <div className='ItemContainer2'>
            <Content className='posterCon'>
              <Poster image={`${comList.thumb_poster_url}`} title={comList.title} />
            </Content>
            {/* <hr style={{backgroundColor: 'black', width: '1px', opacity: '0.6'}} /> */}

            <Content className='DetailInfoContainer' style={{width: '60%' }}>
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