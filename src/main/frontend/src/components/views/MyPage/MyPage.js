import React, { useEffect, useState } from 'react';
import { ScheduleOutlined, DeleteOutlined, WhatsAppOutlined, GithubFilled, EditOutlined, BookOutlined, UserDeleteOutlined} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import MainHeader from '../MainHeader/MainHeader';
import { Route, Routes, useNavigate } from 'react-router-dom';
import RList from './section/RList';
import CList from './section/CList';
import Contact from './section/Iquiry/Contact';
import IqList from './section/Iquiry/IqList';
import Footer from '../Footer/Footer';
import InfoUpdate from './section/InfoUpdate';
import styled from 'styled-components';
import MemberApi from '../../../api/MemberApi';
import { useSelector } from 'react-redux';
import WishList from './section/WishList';
import Delete from './section/Delete';

const MyInfoStyle = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  min-width: 930px;
  h4{
    font-size: 18px;
    strong{
      font-size: 22px;
    }
  }
  .userInfo {
    display: flex;
    border: 1px solid black;
    width: 50%;
    min-width: 660px;
    /* height: 350px; */
    margin: 0 auto;
    margin-top: 20px;
  }
  .my-info {
    display: flex;
  }
  .info-des {
    margin: 1.5rem 0;
    font-size: 17px;
    border-left: 2px solid black;
  }
  .description {
    margin-top: 10px;
    margin-left: 1.5rem;
  }
  .point-box {
    border: 1px solid brown;
    border-radius: 12rem;
  }
  .up-button {
    font-size: 18px;
    border: none; 
  }
  .up-wrap{
    display: flex;
    justify-content: center;
}
  .MypageMainContainer{
    height : 100%;
    /* width: 65%; */
  }
  .MypageDataContainer{
    width: 50%;
    margin: 23px auto;
    min-width: 800px;
    min-height: 400px;
  }
  @media(max-width : 1024px){
    .userInfo{
      width: 80%;
    }
    .MypageDataContainer{
      width: 70%;
    }
}
`;

function MyPage() {
  const userInfo = useSelector((state) => state.user.info);

if(!userInfo.userEmail) {
  alert("로그인 후 이용해주세요.")
  // document.location.href="http://www.tcat.pe.kr:8100"
  document.location.href="http://localhost:8100"
} 

  const { Content, Sider } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const [info, SetInfo] = useState('');


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
        SetInfo(res.data.results);
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
        SetInfo(res.data.results);
        console.log(res.data);
      }
    } catch (e) {
      console.log(e);
    }
  }
    
  useEffect(() => {
    const el = document.getElementsByClassName('ant-layout-sider-trigger');
    el[0].style.position = 'relative';
    // const el2 = document.getElementsByClassName('ant-layout-sider-children');
    // el2[0].style.height = '225px';
    // const el3 = document.getElementsByClassName('ant-layout-sider ant-layout-sider-dark ant-layout-sider-has-trigger');
    // el3[0].style.background = 'none';
  });
  
  function getItem(label, key, icon, children) {
    return { key, icon, children,label };
  }
  
  const items = [
    getItem('예매 내역', '/MyPage/RList', <ScheduleOutlined />),
    getItem('취소 내역', '/MyPage/CList', <DeleteOutlined />),
    getItem('문의 관련', 'sub1', <WhatsAppOutlined />, [
      getItem('문의 하기', '/MyPage/Contact'),
      getItem('문의 조회', '/MyPage/IqList'),
    ]),
    getItem('회원 정보 변경', '/MyPage/InfoUpdate', <EditOutlined />),
    getItem('내가 찜한 목록', '/MyPage/WishList', <BookOutlined />),
    getItem('회원탈퇴', '/MyPage/delete', <UserDeleteOutlined />)
  ];
  const navigate = useNavigate();
  
  return (
    <MyInfoStyle> 
    <MainHeader/>
    <Layout>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{minHeight: 'auto'}}>
        {/* <div className="logo" /> */}
        <Menu theme="dark" mode="inline" items={items} onClick={({key}) => navigate(key)}/>
      </Sider>
      <Layout className="site-layout">
        <Content className='MypageMainContainer'>
          <div className="site-layout-background">
            <div>

              <div className='userInfo'>
                <div className='Contain1'>
                  <GithubFilled style={{fontSize: '10rem', margin: '2rem'}} />
                </div>
                  <div className='info-des'>
                    <div className='description'>
                      <h4><strong>{info.name}</strong>님 오늘도 TCat을 방문해주셔 감사합니다. 좋은 하루 되세요</h4>
                      <p>나의 아이디는 {info.id}</p>
                      <p>나의 이메일은 {info.email}</p>
                      <p>현재 회원님의 포인트는 {info.point}</p>
                    </div>
                  </div>
              </div>
          </div>
          </div>
          <div className='MypageDataContainer' >
            <MyBody />
          </div>
        </Content>
      </Layout>
    </Layout>
    <Footer/>
    </MyInfoStyle>
  );
}

const MyBody = () => (
  <>
    <Routes>
      <Route path='/RList' element={<RList/>}/>
      <Route path='/CList' element={<CList/>}/>
      <Route path='/Contact' element={<Contact/>}/>
      <Route path='/IqLIst' element={<IqList/>}/>
      <Route path='/WishList' element={<WishList/>}/>
      <Route path='/delete' element={<Delete />}/>
      <Route exact path='/InfoUpdate' element={<InfoUpdate />} />
    </Routes>
    </>
);


export default MyPage;