import { useEffect, useState } from "react"
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
    .Content{
        margin: 0 auto;
        margin-top: 40px;
        margin-bottom: 80px;
        width: 80%;
    }
    hr{
        margin: 0px;
        padding: 0px;
    }

    .InfoContainer{
        margin-top: 40px;
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
    useEffect(() => {
        const SearchAsync = async() =>{
            try{
                const res = await MainApi.mainsearch(text)
                if(res.data.statusCode === 200){
                    console.log("성공")
                    setSearchData(res.data.results);
                    setIsFinish(true);
                }
            }catch(e){
                console.log(e)
            }
        }
        SearchAsync();
        setIsFinish(false);
    },[])
    console.log(SearchData)

    return(
        <>
        <SearchContainer>
            <MainHeader/>

            {isFinish && SearchData.length === 0 ?
                <>
                    <NoresultContainer>
                        {/* 검색결과 없는경우 */}
                        <div className="Content">    
                            <div className="item"><img src={process.env.PUBLIC_URL + '/images/TCat.jpg'}></img></div>
                            <div className="item"><p>검색 결과가 없습니다.</p></div>
                        </div>
                    </NoresultContainer>
                </>
                :
                <>
                    <div className="Content">
                        <h2>{text} 검색결과</h2>
                    </div>
                    <div className="InfoContainer">
                        <table>
                            <tr>
                                <th></th>
                                <th>상품명</th>
                                <th>장소</th>
                                <th>기간</th>
                            </tr>
                            {/* 검색결과 있는경우 */}
                            {isFinish && SearchData.map((SearchData , index)=>(
                            <tr key={index}>
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