import styled from "styled-components";

const HeaderContainer = styled.div`
    h1{
        margin: 20000px;
        padding: 0;
    }
    .HeaderDiv{
        display: flex;
        justify-content: space-between;        
        margin: 0 auto;
    }
    li{
        display: flex;
        justify-content: center;
        list-style: none;
        width: 150px;
        font-size: 18px;
    }
`;

function PopupHeader(props) {
    const { index } = props;

    const HeadReturn = () => (
        <>
        {index === 1 &&
        <>
        <h2>T-Cat 예매</h2>
        <div className='HeaderDiv'>
            <li style={{color: 'red'}}>01 좌석선택</li>
            <li>02 가격/할인선택</li>
            <li>03 결제하기</li>
        </div>
        </>
        }
        {index === 2 &&
        <>
        <h2>T-Cat 예매</h2>
        <div className='HeaderDiv'>
            <li>01 좌석선택</li>
            <li style={{color: 'red'}}>02 가격/할인선택</li>
            <li>03 결제하기</li>
        </div>
        </>
        }
        {index === 3 &&
        <>
        <h2>T-Cat 예매</h2>
        <div className='HeaderDiv'>
            <li>01 좌석선택</li>
            <li>02 가격/할인선택</li>
            <li style={{color: 'red'}}>03 결제하기</li>
        </div>
        </>
        }
        </>

    )
    return(
    <HeaderContainer>
        <HeadReturn/>
    </HeaderContainer>
    );
}

export default PopupHeader;