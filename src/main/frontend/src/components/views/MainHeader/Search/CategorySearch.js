import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MainApi from "../../../../api/MainApi";
import Footer from "../../Footer/Footer";
import MainHeader from "../MainHeader";
import { LoadingOutlined } from "@ant-design/icons/lib/icons";

const SearchContainer = styled.div`
    width: 100%;
    min-width: 930px;
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

    /* .InfoContainer{ */
        table{
            margin-top: 40px;
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
        tr:hover{
            cursor: pointer;
            background-color: #f5f5f5;
            font-weight: bold;
        }
        img{
            width: 160px;
            height: 190px;
        }
        .imgContainer{
            width: 160px;
        }
    /* } */
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
const rankings = [
    {
        name : 'rankingWeek',
        text : '주간랭킹',
    },
    {
        name : 'rankingMonth',
        text : '월간랭킹',
    },
    // {
    //     name : 'rankingClose',
    //     text : '종료임박',
    // },
    
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
// 해더 클릭시, 페이지 이동후 , 해더가 작동하지 않음
const CategorySearch = () => {
    const [ranking , setRanking] = useState('rankingWeek');
    const [selectRanking , setSelectRanking] = useState('주간랭킹');
    const [category , setCategory] = useState(window.localStorage.getItem("category"));
    const [selectCategory, setSelectCategory] = useState(window.localStorage.getItem("categoryName"));
    const [SearchData , setSearchData] = useState('');
    const [isFinish , setIsFinish] = useState(false);
    const [nowLoading ,setNowLoading] = useState(true);

    const Navigate = useNavigate();
    // 화면에 선택한 랭킹 , 카테고리 보여주기위한 함수
    const clickRanking = (e ,a) =>{
        setRanking(e);
        setSelectRanking(a);
    }
    // 아이탬 선택시 상세페이지 이동
    const clickItem = (e) =>{
        Navigate(`/detail/${e}`)
    }
    // 선택한 카테고리별 or 랭킹별 useEffect
    const clickCategory = (e ,a) =>{
        setCategory(e);
        setSelectCategory(a);
    }

    useEffect(() => {
        setNowLoading(true);
        const SearchAsync = async() =>{
            try{
                if(ranking === 'rankingWeek'){
                    const res = await MainApi.rankingWeek(category, 20);
                    if(res.data.statusCode === 200){
                        console.log("주간랭킹")
                        setSearchData(res.data.results)
                    }
                }else if (ranking === 'rankingMonth'){
                    const res = await MainApi.rankingMonth(category, 20);
                    if(res.data.statusCode === 200){
                        console.log("월간랭킹")
                        setSearchData(res.data.results)
                    }
                }
                // else if(ranking === 'rankingClose'){
                //     const res = await MainApi.rankingArea(category, 20);
                //     if(res.data.statusCode === 200){
                //         console.log("종료임박")
                //         setSearchData(res.data.results)
                //     }
                // }
                else console.log("실패")
            }catch(e){
                console.log(e);
            }
            setIsFinish(true)
        } 
        setNowLoading(false);
        setIsFinish(false);
        SearchAsync();
        window.localStorage.setItem("category" ,'')
    },[selectRanking,category,window.localStorage.getItem("category")])
// console.log(SearchData);
    return(
        // 버튼영역
        <SearchContainer>
            <MainHeader/>
            <div className="Content">
                <h2>{selectCategory} {selectRanking}</h2>
                <div className="ItemButtonContainer">
                    <div className="ButtonContainer">
                        {rankings.map ((rankings , index) =>(
                            <button key={index} onClick={()=>{clickRanking(rankings.name ,rankings.text)}}>{rankings.text}</button>
                        ))}
                    </div>            
                    <div className="ButtonContainer">
                        {categories.map((categories , index) =>(
                            <button key={index} onClick={()=>{clickCategory(categories.name ,categories.text)}}>{categories.text}</button>
                        ))}
                    </div>
                </div>
                
            {/* 아이템영역 */}
                {nowLoading && <LoadingOutlined style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '300px', marginTop: '100px'}} />}
                <table>
                    <th></th>
                    <th>상품명</th>
                    <th>장소</th>
                    <th>기간</th>
                    {isFinish && SearchData.map((SearchData , index)=>(
                    <tr key={index} onClick={()=>{clickItem(SearchData.code)}}>
                        <td className="imgContainer"><img src={SearchData.product.poster_url} alt=''></img></td>
                        <td className="titleContainer">{SearchData.product.title}</td>
                        <td className="addrContainer">{SearchData.product.location}</td>
                        <td className="dayContainer">
                        {/* 당일공연 체크 */}
                        {SearchData.product.period_end === '당일 공연' ? 
                        <>{SearchData.product.period_end}</>
                        :
                        <>
                            <>{SearchData.product.period_start}</>
                            <br/>~<br/>
                            <>{SearchData.product.period_end}</>
                        </>    
                    }
                        </td>
                    </tr>
                        ))}
                    </table>
            </div>
            <Footer/>
        </SearchContainer>
    )
}

export default CategorySearch;