import styled from "styled-components";
import {UserOutlined} from "@ant-design/icons";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState } from "react";


const HeaderContainer = styled.div`
    @media (max-width : 911px){
        .me-2{
            width:20rem;
        }
    }
    .Logo{
        width   :150px;
        height: 50px;
        margin: 0px;
        padding: 0px;
    }
    /* 검색창 */
    .me-2{
        width:15rem;
    }
    .HederMenu{
        font-family: sans-serif;
        font-weight: bold;
        border-radius: 10px;
        transition: all 0.4s;
    }
    .HederMenu:hover{
        background-color: #86868b;
        color: white;
    }
    /* 검색버튼 */
    .SearchBtn{
        color: black;
        border: 1px solid #367E18;
        margin-right: 8px;
    }
    .SearchBtn:hover{
        background-color: #367E18;
        color: white;
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
    .optionItem:hover{
        
    }
    width: 100%;
    background-color: #f5f5f5;
    `;
const LoginTag = styled.div`
    ul{
        margin: 0;
    }
    a{
        display: inline-block;
        margin: 0 10px;     
    }
`    
const MainHeader = () =>{

    const[categoryvalue,setcategoryvalue] = useState("");

    const onClickValue = (e) =>{
        const val = e.target.value
        setcategoryvalue(val);
    }
    // console.log(categoryvalue);

    return(
        <>
        <LoginTag>
            {/* 여기에 추가해서 사용하시면 될거같습니다 ! 나중에 삭제할 예정이라 막 추가하셔도 될거같습니다. */}
                <a href="/login">로그인</a>
                <a href="/sign">회원가입</a>
                <a href="/admin">관리자페이지</a>
                <a href="/MyPage">MyPage</a>
                <a href="/detail">상세페이지</a>
        </LoginTag>    
            <HeaderContainer>
                <Navbar expand="lg">
                <Container fluid>
                    <Navbar.Brand href="/" ><img className="Logo" src="images/TCat.jpg" alt=""></img></Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0"navbarScroll>
                        <Nav.Link className="HederMenu" href="#action1">뮤지컬</Nav.Link>
                        <Nav.Link className="HederMenu" href="#action2">클래식/무용</Nav.Link>
                        <Nav.Link className="HederMenu" href="#action3">연극</Nav.Link>
                        <Nav.Link className="HederMenu" href="#action4">전시회</Nav.Link>
                    </Nav>
                    {/* title={categoryvalue} */}
                        {/* <NavDropdown className="HederCategory" title="카테고리"  id="navbarScrollingDropdown">
                                <li className="optionItem" value="작품명">작품명</li>
                                <li className="optionItem" value="배우명">배우명</li>
                                <li className="optionItem" value="감독명">감독명</li>
                        </NavDropdown> */}
                    <Form className="d-flex">
                        <Form.Control onChange={onClickValue} type="search" placeholder="Search" className="me-2" aria-label="Search"/>
                        <Button className="SearchBtn" variant="outline-success">Search</Button>
                        <UserOutlined className="User"/>
                    </Form>    
                    </Navbar.Collapse>
                </Container>
                </Navbar>
            </HeaderContainer>
    </>
    )
}


export default MainHeader;