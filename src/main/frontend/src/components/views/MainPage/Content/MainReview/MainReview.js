import { useEffect, useState } from "react"
import styled from "styled-components"
import AdminApi from "../../../../../api/AdminApi"

const MainReviewContainer = styled.div`
    width: 100%;
    .ReviewBox{
        display: flex;
        justify-content: center;
        margin: 20px 0;
        height: 240px;
    }
    .MainReviewContents{
        /* border: 1px solid black; */
        border: 1px solid silver;
        margin: 0 5px;
    }
    li{
        width: 23%;
        list-style: none;
        float: left;
    }
    hr{
        margin: 0;
        padding: 0px;
    }
    .ReviewContents{
        margin:5px;
        opacity: 60%;
    }
    .con{
        white-space: normal;
        word-wrap: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 8;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .minititle{
        background-color: #f5f5f5;
        margin: 0;
        text-align: center;
        text-overflow: ellipsis;
        overflow:hidden;
        white-space: nowrap;
        opacity: 90%;
    }
    h2{
        font-size: 1.5em;
        font-weight: bold;
        margin:20px 0 20px 20px ;
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

    console.log(reviewItem);

    return(
        <MainReviewContainer>
            <div className="TitleBox">
            <h2>관람 후기</h2>
            </div>
            <div className="ReviewBox">
            {isFinish && reviewItem.map ((reviewItem , index) => (
                <li className="MainReviewContents" key={index}>
                    <p className="minititle">{reviewItem.title}</p>
                <hr></hr>
                <div className="ReviewContents">
                    <p className="con">{reviewItem.content}</p>
                </div>
            </li>
            ))}
            </div>
        </MainReviewContainer>
    )
}

export default MainReview