import styled from "styled-components";
import {UserOutlined} from "@ant-design/icons";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState } from "react";
import { Link } from "react-router-dom";


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
    a{
        text-decoration:none;
        color : inherit;
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
    width: 100%;
    background-color: #f5f5f5;
    `;
const MainHeader = () =>{

    const[searchText,SetSearchText] = useState("");

    const onClickValue = (e) =>{
        const val = e.target.value
        SetSearchText(val);
    }
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
                        <Link to = "/search" className = "HeaderMenu">뮤지컬</Link>
                        <Link to = "/search" className = "HeaderMenu">클래식/무용</Link>
                        <Link to = "/search" className = "HeaderMenu">연극</Link>
                        <Link to = "/search" className = "HeaderMenu">전시회</Link>
                        <Link to = "/admin" className = "HeaderMenu">관리자</Link>
                        <Link to = "/detail" className = "HeaderMenu">상세</Link>
                    </Nav>
                    <Form className="d-flex">
                        <Form.Control onChange={onClickValue} type="search" placeholder="Search" className="me-2" aria-label="Search"/>
                        <Button className="SearchBtn" variant="outline-success"><a href="/search">Search</a></Button>
                        <Link to = "/login"><UserOutlined className="User"/></Link>
                    </Form>    
                    </Navbar.Collapse>
                </Container>
                </Navbar>
            </HeaderContainer>
    </>
    )
}


export default MainHeader;