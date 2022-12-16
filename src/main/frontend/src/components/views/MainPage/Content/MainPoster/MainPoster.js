// import PosterImg from "./PosterImg.js";
import styled from "styled-components";
import RankingWeek from "./RankingWeek";

const PosterContainer = styled.div`
    width: 47%;
    margin: 0 10px;
    align-items: center;
    display: inline-block;
    /* border: solid 1px black; */
    a {
        float: right;
        text-decoration:none;
        color: #1a1a1a;
        margin-right:30px;
        opacity: 80%;
    }
    a:hover{
        opacity: 100%;
    }
    @media (max-width : 1440px){
        width: 100%;
        margin: 10px 0;
    }
    `

const Poster = () =>{
    return(
        <PosterContainer>
            <RankingWeek/>
        </PosterContainer>
    )
}

export default Poster;