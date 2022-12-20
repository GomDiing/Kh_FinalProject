import React, { useEffect, useState } from 'react';
import {Layout} from 'antd';
import TCalendar from './Section/Side/TCalendar'
import Poster from './Section/Summary/Poster';
import Info from './Section/Summary/Info';
import MainHeader from '../MainHeader/MainHeader';
import Footer from '../Footer/Footer';
import styled from 'styled-components';
import { BsArrowUpCircle } from 'react-icons/bs';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DetailApi from '../../../api/DetailApi';
import Contents from './Section/Body/Contents';
import GridCards from '../Cards/GridCards';
import Reviews from './Section/Body/Reviews';
import { useParams } from 'react-router-dom';
import NowLoading from '../../../util/Loading';
import { useSelector } from 'react-redux';

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
  height: auto;
  position: fixed; 
  left: 70%;
  /* top: 6.5rem; */
  /* bottom: 0; */
  bottom: 100px;
  padding-bottom: 40px;

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
  const [nowLoading, setNowLoading] = useState(false);
  const {code} = useParams();
  const [ScrollY, setScrollY] = useState(0);
  const [BtnStatus, setBtnStatus] = useState(false);
  const [pCode, setPcode] = useState('');
  const [ckList, setCkList] = useState([]);
  const [comList, setComList] = useState([]);
  const [seat, setSeat] = useState([]);
  const [stat, setStat] = useState([]);
  const [cast, setCast] = useState([]);
  const [key, setKey] = useState('info');
  const [dateList, setDateList] = useState('');
  const [open, setOpen] = useState(false);
  const [castInfo, setCastInfo] = useState(false);
  
  // 로그인 유저 정보를 리덕스에서 가져옴
  const userInfo = useSelector((state) => state.user.info)
    
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
    setNowLoading(true);
    setPcode(code);
    const getData = async()=> {
      try {
        const res = await DetailApi.getDetail(pCode);
        if(res.data.statusCode === 200){
          console.log(res.data.results);
          // checkList 특정 요소의 유무 판단
          setCkList(res.data.results.check_list);
          setCastInfo(res.data.results.check_list.is_info_casting);
          // comList 상세 상품에 표기할 정보 모음
          setComList(res.data.results.compact_list);
          // 좌석/가격 정보
          setSeat(res.data.results.seat_price_list);
          // 통계 정보
          setStat(res.data.results.statistics_list);
          // 캐스팅 정보
          setCast(res.data.results.info_casting);
          // 예매 정보
          setDateList(res.data.results.calendar_list[0]);
          console.log(res.data.results.calendar_list);
          setOpen(true);
          // setContent(res.data.results.compact_list.detail_poster_url);
        } else {
          alert("데이터 조회가 실패.")
        }
      } catch (e) {
        console.log(e);
      }
    };
    setNowLoading(false);
    getData();
  }, [pCode]);
  

  return (
    <DWrap>
      {nowLoading && <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><NowLoading/></div>}
      <button className={BtnStatus ? "topBtn active" : "topBtn"} onClick={handleTop}>
      <BsArrowUpCircle className='arrow'/>
        </button>
      <MainHeader/>
      <Layout style={{width: '80%', height: '100%' ,margin:'0 auto', backgroundColor: 'white'}}>
        <Content >
          <Layout className="site-layout-background" >
            <div className='ItemContainer2'>
            <Content className='posterCon'>
              <Poster image={`${comList.thumb_poster_url}`} title={comList.title} rate={comList.rate_averrage}/>
            </Content>
            {/* <hr style={{backgroundColor: 'black', width: '1px', opacity: '0.6'}} /> */}

            <Content className='DetailInfoContainer' style={{width: '60%' }}>
              <Info loc={comList.location} start={comList.period_start} end={comList.period_end} 
              time={comList.perf_time_minutes} break={comList.perf_time_break} age={comList.age}
              kage={ckList.is_age_korean} seat={seat} loc2={comList.detail_location}/>
            </Content>
            </div>

            <Sider className="detailSiderContainer" width={310}>
              {open && <TCalendar userInfo={userInfo} dateList={dateList} title={comList.title} code={comList.code}
              cast={ckList.is_info_casting} seat={seat} reserve={ckList.is_next_reserve} dim={ckList.reserve_day_in_month}/>}
            </Sider>
          </Layout>
          <br/>

        <Content>
          <div style={{width: '70%'}}>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
            style={{fontSize: '16px'}}
            >
            <Tab eventKey="info" title="공연정보">
            <Contents image={comList.detail_poster_url} stat={stat}/>
            </Tab>
            <Tab eventKey="cast" title="캐스팅 정보">
            {castInfo === false ? <h2 style={{margin: '2rem'}}>캐스팅 정보가 없습니다.</h2> : 
            <>
            {cast && cast.map((cast, id) => (
            <React.Fragment key={id}>
            <GridCards image={cast.image_url} character={cast.character} actor={cast.actor} url={cast.info_url}/>
            </React.Fragment>
            ))}</>
            }
            </Tab>
            <Tab eventKey="profile" title="관람후기">
            <Reviews/>
            </Tab>
          </Tabs>
          </div>
        </Content>
        </Content>
        <Footer/>
      </Layout>
    </DWrap>
  )
}
  
export default Detail;