import styled from "styled-components";
import HorizontalScroll from 'react-horizontal-scrolling'
import { useEffect, useState } from "react";
import MainApi from "../../../../../api/MainApi";

const PosterImgContainer = styled.div`        
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    /* border: solid 1px black; */
    
    img{
        width: 110px;
        height: 130px;
    }
    ul{
        display: flex;
        /* width: 100%; */
        list-style: none;
        margin: 0px;
        padding: 0px;
        /* overflow-x: auto; */
        overflow: hidden;
    }
    /* ul::-webkit-scrollbar {
        display: none;
    } */
    li{
        align-items: center;
        list-style: none;
        /* display: inline-block; */
        margin:0 15px;
    }
    p{
        width: 110px;
        margin-top:10px;
        font-size: 1em;
    }
    @media (max-width : 1440px){
        img{
            width: 140px;
            height: 160px;
        }
        li{
            margin:0 10px;
        }
    }
`
const PosterCategoryContainer = styled.div`
    width: 100%;
    margin: 30px 0;
    .PosterTitle{
        margin: 5px;
    }
    h2{
        display: inline-block;
        font-size: 1.5em;
        font-weight: bold;
        margin: 0 1 0px;
    }
    li{
        font-size: 1.2em;
        display: inline-block;
        list-style: none;
        border-radius: 10px;
        padding :0.5em;
        cursor: pointer;
        transition: all 0.4s;
        margin: 0 5px;
    }
    li:hover{
        background-color: #86868b;
        color: white;
    }
    @media (max-width : 1440px){
        margin: 10px 0;
    }
    `


const HWrap = styled.div`
.HorizontalScrollTrack {
    display: hidden;
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
        {
            id : "1",
            name : '1번작품',
            img : 'http://ticketimage.interpark.com/rz/image/play/goods/poster/22/22012184_p_s.jpg'
        },
        {
            id : "1",
            name : '1번작품',
            img : 'http://ticketimage.interpark.com/rz/image/play/goods/poster/22/22012184_p_s.jpg'
        },
        {
            id : "1",
            name : '1번작품',
            img : 'http://ticketimage.interpark.com/rz/image/play/goods/poster/22/22012184_p_s.jpg'
        },
    ]

    const categories = [
        {
            name : 'MUSICAL',
            text : '뮤지컬'
        },
        {
            name : 'CLASSIC',
            text : '클래식 / 무용'
        },
        {
            name : 'DRAMA',
            text : '연극'
        },
        {
            name : 'EXHIBITION',
            text : '전시회'
        }
    ]

const RankingWeek = () =>{
    const [category , setCategory] = useState('MUSICAL');
    const size = 10;
    const onSelect = (e) =>{
        setCategory(e)
    }


    useEffect(() => {
        const PosterAsunc = async() =>{
            try{
                // console.log(category)
                const res = await MainApi.rankingWeek(category, size);
                console.log(res.data);
                
            }catch(e){
                console.log(e);
            }
        }
        PosterAsunc();
    }, [category])
        return(
            <>
                <PosterCategoryContainer>
                    <div className="PosterTitle">
                        <h2>주간랭킹</h2>
                    {categories.map(c=>(
                        <li 
                            key={c.name}
                            active={category === c.name}
                            // ER
                            onClick={()=>onSelect(c.name)}
                        >{c.text}</li>
                    ))}
                    </div>
                </PosterCategoryContainer>
                
                <HWrap>
                    <HorizontalScroll>
                        <PosterImgContainer>
                    <ul>
                        {posterInfo.map(c=>(
                            <li key={c.id} >
                                <img src={c.img} alt=""/>
                                <p>{c.name}</p>
                            </li>
                        ))}
                    </ul>
                    </PosterImgContainer>
                    </HorizontalScroll>
                </HWrap>
            </>
    )
}
export default RankingWeek;

