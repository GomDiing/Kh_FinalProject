import styled from "styled-components"

const BodyContainer = styled.div`
    /* max-height: 800px; */
    
    img{
        width: 100%;
        height: 230px;
    }
`
const CancelModalBody = () => {
    
    return(
        <BodyContainer>
            <div>
                <div>
                    <img src={process.env.PUBLIC_URL + '/images/Cancel1.jpg'}/>
                    <p>1. 로그인 후 예매내역을 선택합니다</p>
                </div>
                <div>
                    <img src={process.env.PUBLIC_URL + '/images/Cancel2.jpg'}/>
                    <p>2. 예매내역에서 취소를 원하는 공연의 상세보기를 클릭합니다.</p>
                </div>
                <div>
                    <img src={process.env.PUBLIC_URL + '/images/Cancel3.jpg'}/>
                    <p>3. 선택하신 정보가 맞으시다면, 결제 취소하기 버튼을 눌러 진행합니다.</p>
                </div>
            </div>
        </BodyContainer>
    );
}

export default CancelModalBody;