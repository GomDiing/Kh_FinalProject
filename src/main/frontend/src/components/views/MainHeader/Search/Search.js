import styled from "styled-components";
import Footer from "../../Footer/Footer";
import MainHeader from "../MainHeader";

const SearchContainer = styled.div`
    width: 100%;

    .Content{
        /* border: 1px solid black; */
        margin: 0 auto;
        width: 80%;
    }
    hr{
        margin: 0px;
        padding: 0px;
    }

    .InfoContainer{
        /* background-color: #f5f5f5; */
        /* margin: 40px auto; */
        /* padding: 40px 0 ; */
        table{
            background-color: white;
            margin : 0px auto;
            width: 100%;
            text-align: center;
        }
        th{
            height: 60px;
            font-size: 18px;
            font-weight: bold;
        }
        td{
            height: 210px;
        }
        th ,tr,td{
            border-bottom: 2px solid #f5f5f5;
            /* height: 40px; */
            /* width: 25%; */
            /* border: 1px solid black; */
        }
        img{
            width: 160px;
            height: 190px;
        }
        .imgContainer{
            width: 160px;
        }
        /* .titleContainer{

        }
        <td className="imgContainer"><img src={c.img}></img></td>
                            <td className="titleContainer">{c.name}</td>
                            <td className="addrContainer">{c.addr}</td>
                            <td className="dayContainer" */
    }
    .ButtonContainer{
        margin: 20px 0;
        display: flex;
        justify-content: center;
        background-color: #f5f5f5;
        border-top-left-radius : 20px;
        border-top-right-radius: 20px;
            button{
                margin: 20px;
                width: 30%;
                height: 50px;
                font-size: 20px;
                font-weight: bold;
                border: 0px solid black;
                border-radius: 20px;
            }
            button:hover{
                background-color: #86868b;
                color: white;
            }
        }
    
`
const posterInfo = [
    {
        id : "1",
        name : '1번작품',
        img : 'http://ticketimage.interpark.com/rz/image/play/goods/poster/22/22012184_p_s.jpg',
        addr : "우리집우리집우리집우리집우리집우리집",
        start : "2022-12-16",
        end : '2022-12-16'
    },
    {
        id : "2",
        name : '2번 작품은 조금 길어진 제목',
        img : 'http://ticketimage.interpark.com/rz/image/play/goods/poster/22/22014586_p_s.jpg',
        addr : "우리집우리집우리집우리집우리집우리집",
        start : "2022-12-16",
        end : '2022-12-16'
    },
    {
        id : "3",
        name : '3번 작품',
        img : 'http://ticketimage.interpark.com/rz/image/play/goods/poster/22/22009029_p_s.jpg',
        addr : "우리집우리집우리집우리집우리집우리집",
        start : "2022-12-16",
        end : '2022-12-16'
    },
    {
        id : "4",
        name : '4번작품',
        img : 'http://ticketimage.interpark.com/rz/image/play/goods/poster/22/22012184_p_s.jpg',
        addr : "우리집우리집우리집우리집우리집우리집",
        start : "2022-12-16",
        end : '2022-12-16'
    },
]
const SearchResult = () => {
    return(
        <SearchContainer>
            <MainHeader/>
            <div className="Content">
                <div className="ButtonContainer">
                    <button>주간랭킹</button>
                    <button>월간랭킹</button>
                    <button>종료임박</button>
                    {/* <hr/> */}
                </div>

                
                <div className="InfoContainer">
                    <table>
                        <tr>
                            <th></th>
                            <th>상품명</th>
                            <th>장소</th>
                            <th>기간</th>
                        </tr>
                        {posterInfo.map(c=>(
                        <tr>
                            <td className="imgContainer"><img src={c.img}></img></td>
                            <td className="titleContainer">{c.name}</td>
                            <td className="addrContainer">{c.addr}</td>
                            <td className="dayContainer">
                                {c.start}
                                <br/>~<br/>
                                {c.end}
                            </td>
                        </tr>
                        ))}
                    </table>
                </div>

                {/* <ul>
                    {posterInfo.map(c=>(
                        <li key={c.id} >
                            <img src={c.img} alt=""/>
                            <p>{c.name}</p>
                        </li>
                    ))}
                </ul> */}
            </div>
            <Footer/>
        </SearchContainer>
    )
}

export default SearchResult;