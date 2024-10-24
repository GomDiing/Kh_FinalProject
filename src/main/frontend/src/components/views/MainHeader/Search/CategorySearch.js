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


const CategorySearch = () => {
    const [ranking, setRanking] = useState('rankingWeek');
    const [selectRanking, setSelectRanking] = useState('주간랭킹');
    const [category, setCategory] = useState(window.localStorage.getItem("category") || '');
    const [selectCategory, setSelectCategory] = useState(window.localStorage.getItem("categoryName") || '');
    const [SearchData, setSearchData] = useState([]);
    const [isFinish, setIsFinish] = useState(false);
    const [nowLoading, setNowLoading] = useState(true);

    const Navigate = useNavigate();

    const clickRanking = (e, a) => {
        setRanking(e);
        setSelectRanking(a);
    }

    const clickItem = (e) => {
        Navigate(`/detail/${e}`)
    }

    const clickCategory = (e, a) => {
        setCategory(e);
        setSelectCategory(a);
        window.localStorage.setItem("category", e);
        window.localStorage.setItem("categoryName", a);
    }

    useEffect(() => {
        setNowLoading(true);
        const SearchAsync = async () => {
            try {
                let res;
                if (ranking === 'rankingWeek') {
                    res = await MainApi.rankingWeek(category, 20);
                } else if (ranking === 'rankingMonth') {
                    res = await MainApi.rankingMonth(category, 20);
                } else {
                    console.log("알 수 없는 랭킹 유형");
                    return;
                }

                if (res.data.statusCode === 200) {
                    setSearchData(res.data.results);
                } else {
                    console.log("API 응답 오류:", res.data.statusCode);
                }
            } catch (e) {
                console.error("API 요청 중 오류 발생:", e);
                setSearchData([]);  // 오류 시 빈 배열로 설정
            } finally {
                setIsFinish(true);
                setNowLoading(false);
            }
        }

        SearchAsync();
    }, [ranking, category]);

    return (
        <SearchContainer>
            <MainHeader />
            <div className="Content">
                <h2>{selectCategory} {selectRanking}</h2>
                <div className="ItemButtonContainer">
                    <div className="ButtonContainer">
                        {rankings.map((ranking, index) => (
                            <button key={index} onClick={() => clickRanking(ranking.name, ranking.text)}>
                                {ranking.text}
                            </button>
                        ))}
                    </div>
                    <div className="ButtonContainer">
                        {categories.map((category, index) => (
                            <button key={index} onClick={() => clickCategory(category.name, category.text)}>
                                {category.text}
                            </button>
                        ))}
                    </div>
                </div>

                {nowLoading ? (
                    <LoadingOutlined style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '300px', marginTop: '100px'}} />
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th></th>
                            <th>상품명</th>
                            <th>장소</th>
                            <th>기간</th>
                        </tr>
                        </thead>
                        <tbody>
                        {SearchData && SearchData.length > 0 ? (
                            SearchData.map((item, index) => (
                                <tr key={index} onClick={() => clickItem(item.code)}>
                                    <td className="imgContainer">
                                        <img src={item.product.poster_url} alt="" />
                                    </td>
                                    <td className="titleContainer">{item.product.title}</td>
                                    <td className="addrContainer">{item.product.location}</td>
                                    <td className="dayContainer">
                                        {item.product.period_end === '당일 공연' ? (
                                            <>{item.product.period_end}</>
                                        ) : (
                                            <>
                                                {item.product.period_start}
                                                <br />~<br />
                                                {item.product.period_end}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">데이터가 없습니다.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>
            <Footer />
        </SearchContainer>
    );
}

export default CategorySearch;