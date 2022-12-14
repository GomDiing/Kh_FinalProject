import styled from "styled-components"

const MainPoster2Container = styled.div`
    width: 100%;
    background-color: #f5f5f5;
    font-family: sans-serif;
    height: 360px;
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
        width: 180px;
        height: 230px;
    }
    ul{
        width: 100%;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        margin: 0 20px;
        padding: 0;
        list-style: none;
    }
    li{   
        list-style: none;
        width:180px;
        margin: 0 5px;
    }
    p{
        text-align: center;
        margin:0px;
        margin-top:5px;
        font-size: 1.2em;
    }
    
    @media (max-width : 1024px){    
        img{
            width: 120px;
            height: 160px;
        }
        li{
            margin: 0 5px;
            width: 120px;
        }
    }
`
const posterInfo = [
    {
        id : "1",
        category : '연극',
        name : '갈매기',
        img : 'http://ticketimage.interpark.com/rz/image/play/goods/poster/22/22015724_p_s.jpg'
    },
    {
        id : "2",
        category : "클래식",
        name : '스미노 하야로 첫 내한 단독 공연',
        img : 'http://ticketimage.interpark.com/rz/image/play/goods/poster/22/22014508_p_s.jpg'
    },
    {
        id : "3",
        category : '뮤지컬',
        name : '베토벤',
        img : 'http://ticketimage.interpark.com/rz/image/play/goods/poster/22/22015806_p_s.jpg'
    },
    {
        id : "4",
        category : '뮤지컬',
        name : '영웅',
        img : 'http://ticketimage.interpark.com/rz/image/play/goods/poster/L0/L0000021_p_s.jpg'
    },
    {
        id : "5",
        category : "연극",
        name : "옥탑방 고양이",
        img : 'http://ticketimage.interpark.com/rz/image/play/goods/poster/21/21013096_p_s.jpg'
    }
]

const MainPoster2 = () =>{
return(
    <MainPoster2Container>
        <ul>
            {posterInfo.map(c=>(
                <div className="MainPoster2Contan">
                    <li key={c.id}>
                        <img src={c.img} alt=""/>
                        <p className="PosterCategory">{c.category}</p>
                        <p className="PosterName">{c.name}</p>
                    </li>
                </div>
            ))}
        </ul>
    </MainPoster2Container>
)
}

export default MainPoster2