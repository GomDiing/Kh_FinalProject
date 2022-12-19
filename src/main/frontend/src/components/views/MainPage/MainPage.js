import styled from "styled-components";
import 'bootstrap/dist/css/bootstrap.min.css';
import ContentWarp from "./Content/ContentWarp";
import MainHeader from "../MainHeader/MainHeader";
import MainIcon from "./Content/MainIcon/MainIcon";
import MainNotice from "./Content/MainNotice/MainNotice";
import MainBanner from "./Content/MainBanner/MainBanner";
import Footer from "../Footer/Footer";
import { useEffect, useState } from "react";
import { BsArrowUpCircle } from "react-icons/bs";
import MainPoster from "./Content/MainPoster/MainPoster";
import RankingClose from "./Content/MainRankingClose/RankingClose";
import MainReview from "./Content/MainReview/MainReview";

const ItemContainer = styled.div`
    width: 80%;
    padding: 0px;
    margin: 0 auto;
    min-width: 930px;
    margin-bottom: 40px;
    /* background-color: #f5f5f7; */
    hr{
        margin: 0;
    }
    `
const MainContainer = styled.div`
    width : 100%;
    margin: 0px;
    padding: 0px;
    min-width: 900px;
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
`

const MainPage = () =>{
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

    return(
        <MainContainer>
            <button className={BtnStatus ? "topBtn active" : "topBtn"} onClick={handleTop}>
            <BsArrowUpCircle className='arrow'/></button>
            <MainHeader/>
                <ContentWarp/>
                    <ItemContainer>
                        
                        <MainPoster/>
                        <MainNotice/>
                        <hr></hr>
                        <MainBanner/>
                        <RankingClose/>

                        <MainReview/>
                        <hr></hr>
                        <MainIcon/>
                        <hr></hr>
                    </ItemContainer>
                    <Footer/>
        </MainContainer>
    )
}

export default MainPage;