// import PosterImg from "./PosterImg.js";
import styled from "styled-components";
import RankingMonth from "./RankingMonth";
import RankingWeek from "./RankingWeek";

const PosterContainer = styled.div`
    width: 50%;
    /* margin: 0 10px; */
    align-items: center;
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