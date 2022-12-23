import styled from "styled-components";
// import {UserOutlined} from "@ant-design/icons";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginActions } from "../../../util/Redux/Slice/userSlice";
import { RiLoginBoxLine , RiLogoutBoxLine } from "react-icons/ri";
import { useEffect } from "react";

const HeaderContainer = styled.div`
    @media (max-width : 911px){
        .me-2{
            width:20rem;
        }
    }
    .Logo{
        width: 130px;
        height: 60px;
        margin: 0px;
        padding: 0px;
    }
    /* 검색창 */
    .me-2{
        width:15rem;
    }
    a{
        text-decoration:none;
        color : inherit;
        cursor: pointer;
    }
    .HeaderMenu{
        padding: 8px;
        align-items: center;
        font-family: sans-serif;
        font-weight: bold;
        border-radius: 10px;
        transition: all 0.4s;
    }
    .HeaderMenu:hover {
        background-color: #86868b;
        color: white;
    }
    /* 검색버튼 */
    .SearchBtn{
        color: black;
        border: 1px solid #86868b;
        margin-right: 8px;
    }
    .SearchBtn:hover,.SearchBtn:focus,.SearchBtn:active{
        background-color: #86868b;
        color: white;
        box-shadow: none;
    }
    /* 로그인 로고 */
    .User{
        font-size: 2.5em;
        margin-right: 8px;
    }
    /* 드롭박스 */
    .HederCategory{
        width:5rem;
        margin-right: 10px;
        border: none;
        /* background-color: #EFF5F5; */
    }

    .optionBox{
        position: relative;
        cursor: pointer;
        
    }
    .optionLabel{
        display: flex;
        align-items: center;
        width: inherit;
        height: inherit;
        border: 0 none;
        outline: 0 none;
        background: transparent;
        cursor: pointer;
    }
    .optionList{
        position: absolute; 
        background: black;
        list-style-type: none;
        overflow: hidden;
        transition: .3s ease-in;
    }

    .optionItem{
        display: block;
        padding : 5px;
        margin-left: 10px;
        cursor: pointer;
    }
    width: 100%;
    background-color: #f5f5f5;
    `;
const MainHeader = () =>{
    const dispatch = useDispatch('');
    const Navigate = useNavigate();
    // 텍스트 검색
    const onChangeValue = (e) =>{
        const val = e.target.value
        window.localStorage.setItem("searchText" , val)        
    }
    // 카테고리 클릭
    const clickCategory = (e ,a) =>{
        window.localStorage.setItem("category" , e)
        window.localStorage.setItem("categoryName" , a)
    }
    // 앤터키 누르면 검색
    const EnterKeypress = () =>{
        if(window.event.keyCode === 13){
            Navigate("/search")
        }
    }
    // 로그아웃
    const clickLogout = () =>{
        const data = {
            userIndex : undefined,
            userId : undefined,
            userPoint : 0,
            userName : undefined,
            userEmail : undefined,
            userProvider_type : undefined,
            userRole : undefined
        }
        dispatch(loginActions.setUserInfo({data}));
        alert('정상적으로 로그아웃 되었습니다.')
    }
    // 확인용
    const userInfo = useSelector((state) => state.user.info)

    console.log(userInfo);
    // console.log(categoryvalue);

    return(
        <>
            <HeaderContainer>
                <Navbar expand="lg">
                <Container fluid>
                    <Navbar.Brand><Link to = "/"><img className="Logo" src={process.env.PUBLIC_URL + '/images/TCat.jpg'} alt=""/></Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0"navbarScroll>
                        <Link to ='/categorySearch' className = "HeaderMenu" onClick={()=>{clickCategory('MUSICAL' ,"뮤지컬")}}>뮤지컬</Link>
                        <Link to ='/categorySearch' className = "HeaderMenu" onClick={()=>{clickCategory('CLASSIC' , "클래식/무용")}}>클래식/무용</Link>
                        <Link to ='/categorySearch' className = "HeaderMenu" onClick={()=>{clickCategory('DRAMA' , "연극")}}>연극</Link>
                        <Link to ='/categorySearch' className = "HeaderMenu" onClick={()=>{clickCategory('EXHIBITION' , "전시회")}}>전시회</Link>
                        {/* 관리자 조건부 랜더링 */}
                        {userInfo.userRole === "Admin" ? 
                        <Link to = "/admin" className = "HeaderMenu">관리자</Link> : ""}
                        
                    </Nav>
                    <Form className="d-flex">
                        <Form.Control onChange={onChangeValue} onKeyPress={EnterKeypress} type="search" placeholder="Search" className="me-2" aria-label="Search"/>
                        <Link to = "/search" ><Button className="SearchBtn" variant="outline-success">Search</Button></Link>
                        {/* 로그인 / 로그아웃 */}
                        {userInfo.userEmail === undefined ? 
                            <Link to = "/login"><RiLoginBoxLine className="User"/></Link>
                            : 
                            <Link><RiLogoutBoxLine className="User" onClick={clickLogout}/></Link>
                            }
                        
                    </Form>    
                    </Navbar.Collapse>
                </Container>
                </Navbar>
            </HeaderContainer>
    </>
    )
}


export default MainHeader;