import { useEffect, useState } from "react"
import styled from "styled-components"
import AdminApi from "../../../../../api/AdminApi"
import { Rate } from "antd";

const MainReviewContainer = styled.div`
    width: 100%;
    margin: 40px 0;
    .ReviewBox{

        margin: 20px 0;
    }
    .MainReviewContents{
        /* border: 1px solid black; */
        border: 1px solid silver;
        margin: 0 5px;
    }
    h2{
        font-size: 1.5em;
        font-weight: bold;
        margin:24px 15px;
    }
    img{
        padding: 10px 5px;
        width: 120px;
        height: 140px;
    }
    ul{
        background-color: #f5f5f5;
        margin: 0;
    }
    li{
        list-style: none;
    }
    span{
        opacity: 70%;
        margin: 20px 0px;
    }
    .itemList{
        margin-right: 60px;

    }
    .title{
        margin-left: 10px;
        font-weight: bold;
    }
    .content{
        margin-left: 30px;
    }
    .textbox{
        padding: 10px;
    }
    @media(max-width : 1024px){
        .ReviewContents{
            margin: 5px;
        }
        .con{
            -webkit-line-clamp: 3;
            height: 100px;
        }
}
`

const MainReview = () =>{
    const [reviewItem,setReviewItem] = useState('');
    const [isFinish , setIsFinish] = useState(false);


    // undifind 때문에 setIsFinish사용
    useEffect(() => {
        const ReviewAsync = async() =>{
            try{
                const res = await AdminApi.recentReview();
                if(res.data.statusCode === 200){
                    setReviewItem(res.data.results)
                    setIsFinish(true);
                }
            }catch(e){
                console.log(e)
            }
        }
        ReviewAsync();
        setIsFinish(false)
    },[])

    // console.log(reviewItem);

    return(
        <MainReviewContainer>
            <div className="TitleBox">
                <h2>관람 후기</h2>
            </div>
            <div className="ReviewBox">
                {/* 아이탬 */}
                {isFinish && reviewItem.map ((reviewItem , index) =>(
                    <ul className="itemInfoContainer" key={index}>
                        <div style={{display :'flex'}}>
                        <img src={reviewItem.thumb_poster_url}></img>
                    
                            <div className="textbox">                        
                                <li className="itemInfo">
                                    <p className="title">{reviewItem.title}</p>
                                </li>
                                <li className="itemInfo">
                                    <p className="content">{reviewItem.content}</p>
                                </li>
                            </div>
                        </div>
                    {/* 사용자정보 */}
                        <li className="userInfo">
                            <span className="itemList">작성자 : {reviewItem.memberId}</span>
                            <span className="itemList">작성 시간 : {reviewItem.createTime}</span>
                            <span className="itemList">평점 :<Rate allowHalf disabled className="rate" value={reviewItem.rate}/></span>
                        </li>
                    <hr/>
                    </ul>
                        ))}
            </div>
            {/* <div className="ReviewBox">
            {isFinish && reviewItem.map ((reviewItem , index) => (
                <>
                    <li className="MainReviewContents" key={index}>
                        <p className="minititle">{reviewItem.title}</p>
                        <p>{reviewItem.memberId} 님의 작성 내용입니다.</p><span>{reviewItem.rate}</span>
                        <div className="ReviewContents">
                            <p className="con">{reviewItem.content}</p>
                        </div>
                    </li>
            </>
            ))}
            </div> */}
        </MainReviewContainer>
    )
}

export default MainReview