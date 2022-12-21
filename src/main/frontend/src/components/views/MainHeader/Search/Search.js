import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import MainApi from "../../../../api/MainApi";
import Footer from "../../Footer/Footer"
import MainHeader from "../MainHeader"

const NoresultContainer = styled.div`
    width: 100%;
    img{
        width: 300px;
        height: 250px;
        margin-top: 150px;
    }
    .Content{
        display: block;
        .item{
            display: flex;
            justify-content: center;
            p{
                font-size: 23px;
                margin-top: 20px;
            }
        }
    }
`
const SearchContainer = styled.div`
    width: 100%;
    min-width: 930px;
    min-height: 83vh;
    margin-bottom: 80px;
    .searchtext{
        font-weight:bold;
        font-size: 30px;
    }
    span{
        font-size: 23px;

    }
    .Content{
        margin: 40px auto;
        width: 80%;
    }
    hr{
        margin: 0px;
        padding: 0px;
    }

    .InfoContainer{
        width: 80%;
        margin : 20px auto;
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
            cursor: pointer;
        }
        tr:hover{
            background-color: #f5f5f5;
            font-weight: bold;
        }
        th ,tr,td{
            border-bottom: 2px solid #f5f5f5;
        }
        img{
            width: 160px;
            height: 190px;
        }
        .imgContainer{
            width: 160px;
        }
    }
    .ButtonContainer{
        display: flex;
        justify-content: center;
            button{
                margin: 10px 20px;
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
            .ItemButtonContainer{
                display: block;
            }
        }

`
const Search = () =>{
    const text = window.localStorage.getItem("searchText")
    const [SearchData, setSearchData] = useState('');
    const [isFinish , setIsFinish] = useState(false);
    const Navigate = useNavigate();

    useEffect(() => {
        const SearchAsync = async() =>{
            try{
                const res = await MainApi.mainsearch(text)
                console.log(res.data)
                if(res.data.statusCode === 200){
                    console.log("성공")
                    setSearchData(res.data.results.content);
                    setIsFinish(true);
                }
            }catch(e){
                console.log(e)
            }
        }
        setIsFinish(false);
        SearchAsync();
    },[])
    
    const ClickItem = (e) =>{
        Navigate(`/detail/${e}`)
    }
    return(
        <>
        <SearchContainer>
            <MainHeader/>

            {isFinish && SearchData.length === 0 ?
                <>
                        {/* 검색결과 없는경우 */}
                    <NoresultContainer>
                        <div className="Content">    
                            <div className="item"><img src={process.env.PUBLIC_URL + '/images/TCat.jpg'}></img></div>
                            <div className="item"><p>검색 결과가 없습니다.</p></div>
                        </div>
                    </NoresultContainer>
                </>
                :
                <>
                    <div className="Content">
                        <span className="searchtext">{text}</span><span> 검색결과</span>
                    </div>
                    <div className="InfoContainer">
                        <table>
                                <th></th>
                                <th>상품명</th>
                                <th>장소</th>
                                <th>기간</th>
                            {/* 검색결과 있는경우 */}
                            
                            {isFinish && SearchData.map((SearchData , index)=>(
                                <tr key={index} onClick={()=>ClickItem(SearchData.code)}>
                                    <td className="imgContainer"><img src={SearchData.poster_url}></img></td>
                                    <td className="titleContainer">{SearchData.title}</td>
                                    <td className="addrContainer">{SearchData.location}</td>
                                    <td className="dayContainer">

                                    {/* 당일공연 조건부랜더링 */}
                                    {SearchData.period_end === '당일 공연' ? 
                                    <>{SearchData.period_end}</>
                                    :
                                    <>
                                        <>{SearchData.period_start}</>
                                        <br/>~<br/>
                                        <>{SearchData.period_end}</>
                                    </>    
                                }
                                    </td>
                            </tr>
                                ))}
                        </table>
                    </div>
                </>
    }
                
        </SearchContainer>
            <Footer/>
        </>
    )
}

export default Search