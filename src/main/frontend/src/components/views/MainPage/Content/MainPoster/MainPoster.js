// import PosterImg from "./PosterImg.js";
import styled from "styled-components";
import RankingMonth from "./RankingMonth";
import RankingWeek from "./RankingWeek";

const PosterContainer = styled.div`
    width: 50%;
    padding : 0 15px;
    height: 400px;
    display: inline-block;
    /* border: solid 1px black; */
    @media (max-width : 1440px){
        width: 100%;
        margin: 10px 0;
    }
    `

const MainPoster = () =>{
    return(
        <>
            <PosterContainer>
                <RankingWeek/>
            </PosterContainer>
            <PosterContainer>
                <RankingMonth/>
            </PosterContainer>
        </>
    )
}

export default MainPoster;