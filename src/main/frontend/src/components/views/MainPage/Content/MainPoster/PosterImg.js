import styled from "styled-components";

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
        overflow-x: auto;
        /* overflow: hidden; */
    }
    ul::-webkit-scrollbar {
        display: none;
    }
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

const PosterImg = () =>{

        return(
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
    )
}
export default PosterImg;

