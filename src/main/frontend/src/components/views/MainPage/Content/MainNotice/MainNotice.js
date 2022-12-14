import styled, { keyframes } from "styled-components"

const MainNoticeContainer = styled.div` 
    @keyframes slide{
        0%{
            transform: translateY(0);
        }
        25%{
            transform: translateY(-30px);
        }
        50%{
            transform: translateY(-60px);
        }
        75%{
            transform: translateY(-90px);
        }
        100%{
            transform: translateY(0px);
        }
    }
    height: 30px;
    overflow: hidden;
    font-family: sans-serif;
    margin: 15px 0;
    .MainNotice{
        margin: 0;
        padding: 0;
    }
    .Notice1{
        display: flex;
        align-items: center;
        animation: slide 20s ease-out infinite;
        height: 30px;
        margin: 0px;
        padding: 0px;
    }
    p{
        margin : 0 5px;
        padding: 0 5px;
        display: flex;
        justify-content: center;
        border-radius: 5px;
        background-color: #fae100;
    }
    .Noticeimg{
        width: 25px;
        height: 20px;
        margin-left: 20px;
        margin-right: 10px;
    }
    @media (max-width : 1440px){
        /* font-size: 0.9em; */
        /* height: 20px; */
        .Noticeimg{
            width: 20px;
            height: 15px;
        }
    }
    `
const notice = [
    {

        id : 'Notice1',
        categories : 'Notice',
        text : '1번 공지사항 내용입니다.'
    },
    {
        id : 'Notice2',
        categories : 'Notice',
        text : '2번 공지사항 내용입니다.'
    },
    {
        id : 'Notice3',
        categories : 'Event',
        text : '3번 이벤트 내용입니다.'
    },
    {
        id : 'Notice4',
        categories : 'Event',
        text : '4번 이벤트 내용입니다.'
    },
]


const MainNotice = () =>{
    
    return(
        <MainNoticeContainer>
            <div className="MainNotice">
                {notice.map(c=>(
                    <div className="Notice1">
                        <img className="Noticeimg" src="https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/6562f7bc017800001.png?type=thumb&opt=C72x72.fwebp" alt=""></img>
                        <p>{c.categories}</p>
                        <span key={c.id} >{c.text}</span>
                        <br></br>
                    </div>
                ))}
            </div>
        </MainNoticeContainer>
    )
}

export default MainNotice