import styled from 'styled-components'
// import './recentComment.css'

// 후기쪽에서 충돌이 나서 바꿔놨는데 혹시 이상 있으시면 알려주세요.
const RecentWrap = styled.div`
.comment-container{
    flex: 2;
    -webkit-box-shadow: 0px 0px 12px -1px #000000; 
    box-shadow: 0px 0px 12px -1px #000000;
    padding: 20px;
    margin-right: 20px;
}

/* .ReviewBox{
    display: flex;
    justify-content: center;
} */
.MainReviewContents{
    /* border: 1px solid black; */
    border: 1px solid silver;
    margin: 0 5px;
}
li{
    list-style: none;
}
/* li{
    width: 23%;
    list-style: none;
    float: left;
}
hr{
    margin: 0;
    padding: 0px;
} */

.con{
    white-space: normal;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.minititle{
    /* background-color: #f5f5f5; */
    margin: auto 0;
    /* text-align: center; */
    /* opacity: 90%; */
    font-size: 18px;
    font-weight: bolder;
    text-overflow: ellipsis;
    overflow:hidden;
    white-space: nowrap;
}
`

const RecentComment=()=>{
    const Review =[
        {
            id : "1",
            title : "첫번째 후기 제목입니다.첫번째 후기 제목입니다.첫번째 후기 제목입니다.첫번째 후기 제목입니다.",
            contents : "재미있습니다."
        },
        {   
            id : "2",
            title : "첫번째 후기 제목입니다.",
            contents : "재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다재미있습니다"
        },
        {
            id : "3",
            title : "첫번째 후기 제목입니다.",
            contents : "재미있습니다."
        },
        {
            id : "3",
            title : "첫번째 후기 제목입니다.",
            contents : "재미있습니다."
        },
        {
            id : "3",
            title : "첫번째 후기 제목입니다.",
            contents : "재미있습니다."
        },
        
    ]

    return(
        <RecentWrap>
        <div className="comment-container">
            <div className="ReviewBox">
            {Review.map (c => (
                <li className="MainReviewContents" key={c.id}>
                    <p className="minititle">{c.title}</p>
                <hr></hr>
                <div className="ReviewContents">
                    <p className="con">{c.contents}</p>
                </div>
            </li>
            ))}
            </div>
        </div>
        </RecentWrap>
    )
}
export default RecentComment;