import { useEffect, useState } from "react"
import HorizontalScroll from "react-horizontal-scrolling"
import { Link } from "react-router-dom"
import styled from "styled-components"
import MainApi from "../../../../../api/MainApi"
const PosterCategoryContainer = styled.div`
    width: 100%;
    margin: 30px 15px;
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


const MainPoster2Container = styled.div`
    width: 100%;
    background-color: #f5f5f5;
    font-family: sans-serif;
    padding: 30px 0;
    display: flex;
    align-items: center;
    .PosterCategory{
        font-weight: bold;
        font-size: 1.2em;
    }
    .PosterName{
        /* font-size: 1em; */
        opacity: 80%;
    }
    img{
        width: 210px;
        height: 260px;
    }
    ul{
        width: 100%;
        overflow: hidden;
        display: flex;
        /* justify-content: space-between; */
        margin: 0 20px;
        padding: 0;
        list-style: none;
    }
    li{   
        /* margin: 0 20px; */
        list-style: none;
        width: 230px;
        margin: 0 5px;
    }
    p{
        text-align: center;
        margin:0px;
        margin-top:5px;
        font-size: 1.2em;
    }
    a{
        text-decoration:none;
        color : inherit;
    }
    
    @media (max-width : 1024px){    
        img{
            width: 240px;
            height: 290px;
        }
        li{
            /* margin: 0 5px; */
            width: 270px;
        }
    }
`


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

const RankingClose = () =>{
    const [category , setCategory] = useState('MUSICAL');
    const [ItemData , setItemData] = useState([]);
    
    const onSelect = (e) =>{
        setCategory(e)
    }

    useEffect(() => {
        const PosterAsunc = async() =>{
            try{
                const res = await MainApi.rankingClose(category, 10);
                if(res.data.statusCode === 200){
                    setItemData(res.data.results)
                }
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
                <h2>종료임박</h2>
            {categories.map((categories , index)=>(
                <li 
                    key={index}
                    onClick={()=>onSelect(categories.name)}
                >{categories.text}</li>
            ))}
            </div>
        </PosterCategoryContainer>
            <div>
                <HorizontalScroll>
                    <MainPoster2Container>
                        <ul>
                            {ItemData.map((ItemData , index)=>(
                                <div className="MainPoster2Contan" key={index}>
                                    <li>
                                        <Link to={`/detail/${ItemData.code}`} >
                                        <img src={ItemData.product.poster_url} code={ItemData.code} alt="이미지오류"/>
                                        <p>{ItemData.product.title}</p>
                                        </Link>
                                    </li>
                                </div>
                            ))}
                        </ul>
                    </MainPoster2Container>
                </HorizontalScroll>
            </div>
    </>
)
}

export default RankingClose