import styled from "styled-components";
import Footer from "../../Footer/Footer";
import PosterImg from "../../MainPage/Content/MainPoster/PosterImg";
import MainHeader from "../MainHeader";

const SearchContainer = styled.div`
    width: 100%;
    .Content{
        border: 1px solid black;
        margin: 0 auto;
        width: 80%;
    }
    
`
const posterInfo = [
    {
        id : "1",
        name : '1번작품',
        img : 'http://ticketimage.interpark.com/rz/image/play/goods/poster/22/22012184_p_s.jpg'
    },
    {
        id : "2",
        name : '2번 작품은 조금 길어진 제목',
        img : 'http://ticketimage.interpark.com/rz/image/play/goods/poster/22/22014586_p_s.jpg'
    },
    {
        id : "3",
        name : '3번 작품',
        img : 'http://ticketimage.interpark.com/rz/image/play/goods/poster/22/22009029_p_s.jpg'
    },
    {
        id : "4",
        name : '4번작품',
        img : 'http://ticketimage.interpark.com/rz/image/play/goods/poster/22/22012184_p_s.jpg'
    },
]
const SearchResult = () => {
    return(
        <SearchContainer>
            <MainHeader/>
            <div className="Content">
                <ul>
                    {posterInfo.map(c=>(
                        <li key={c.id} >
                            <img src={c.img} alt=""/>
                            <p>{c.name}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <Footer/>
        </SearchContainer>
    )
}

export default SearchResult;