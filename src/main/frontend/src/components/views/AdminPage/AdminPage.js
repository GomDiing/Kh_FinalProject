import React from 'react'
import {Routes, Route, useNavigate} from "react-router-dom";
import {Menu} from 'antd';
import {HomeOutlined, PoweroffOutlined,UserOutlined,SolutionOutlined,LayoutOutlined,BulbOutlined,WhatsAppOutlined} from "@ant-design/icons/lib/icons";
import styled from 'styled-components';
import AdminHome from './Dashboard/AdminHome';
import MemberList from './MemberList';
import BlackList from './BlackList';
import Banner from './Banner';
import PostManagement from './PostManagement';
import WriteNotice from './Notice/WirteNotice';
import NoticeDetail from './Notice/NoticeDetail';
import NoticeList from './Notice/NoticeList';
import Inquiry from './Inquiry/Inquiry';
import UpdateNotice from './Notice/UpdateNotice';
import { loginActions } from '../../../util/Redux/Slice/userSlice';
import { useDispatch } from 'react-redux';

const HeaderBlock=styled.div`
  background-color: #92A9BD;
  justify-content: center;
  align-items: center;
  .logoContainer{
    height: 76px;
    display: flex;
    align-items: center;
}
  .logo{
        width   :150px;
        height: 50px;
        margin: 3px 15px;
        padding: 0px;
    }
`;
function AdminPage() {
  return (
    <div style={{display : "flex", flexDirection:"column", flex : 1, height : '100vh', width : "100%", minWidth : '1024px'}}>
      <Header/>
      <div style={{display : "flex", flexDirection:"row", flex : 1}}>
        <SideMenu/>
        <Content/>
      </div>
    </div>
  );
}
function Header() {
  return(
    <HeaderBlock>
      <div className='logoContainer'>
        <a href='/'>
        <img className="logo" src={process.env.PUBLIC_URL + '/images/TCat.jpg'} alt = ""/>
        </a>
      </div>
    </HeaderBlock>
  );
}
function SideMenu() {
  const dispatch = useDispatch('');
  const navigate = useNavigate();
  return(
    <Menu style={{backgroundColor : '#f5f5f5'}}
      onClick={({key})=>{
        if(key === "로그아웃"){
              const data = {
                  userIndex : undefined,
                  userId : undefined,
                  userPoint : undefined,
              }
              dispatch(loginActions.setUserInfo({data}));
              alert('관리자 로그아웃 성공');
              navigate('/login');
        } else {
          navigate(key);
        }
      }}
      // 사이드바 클릭하면 주소 url값 변경되게 
      defaultSelectedKeys={[window.location.pathname]}
      items={[
        {label:"Home", key:"/admin",icon:<HomeOutlined/>},
        {label:"회원관리", key:"/admin/member", 
          children:[{label : "일반회원", key:"/admin/normal"},
                    {label : "블랙리스트", key:"/admin/black"}], icon:<UserOutlined/>},
        {label:"게시물관리", key:"/admin/enroll", icon:<LayoutOutlined />},
        {label:"광고관리", key:"/admin/ad", icon:<BulbOutlined />},
        {label:"공지사항 관리", key:"/admin/noticeList", icon:<SolutionOutlined/>},
        {label:"1대1 문의", key:"/admin/inquiry", icon:<WhatsAppOutlined />},
        {label:"로그아웃", key:'로그아웃', icon:<PoweroffOutlined/>,danger:true},
    ]}>
      </Menu>
  );
}
function Content() {
  return(
    <Routes>
      <Route path='/' element={<AdminHome/>}/>
      <Route path='/normal' element={<MemberList/>}/>
      <Route path='/black' element={<BlackList/>}/>
      <Route path='/enroll' element={<PostManagement/>}/>
      <Route path='/ad' element={<Banner/>}/>
      <Route path='/noticeList' element={<NoticeList/>}/>
      <Route path='/inquiry' element={<Inquiry/>}/>
      <Route path='/writeNotice' element={<WriteNotice/>}/>
      <Route exact path='/noticeDetail/:index' element={<NoticeDetail/>}/>
      <Route exact path='/noticeUpdate/:index' element={<UpdateNotice/>}/>
    </Routes>
  );
}
export default AdminPage;