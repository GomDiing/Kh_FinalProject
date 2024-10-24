import styled from "styled-components"
import iconCancel1 from "../../../../../../../images/Cancel1.png"
import iconCancel2 from "../../../../../../../images/Cancel2.jpg"
import iconCancel3 from "../../../../../../../images/Cancel3.png"

const BodyContainer = styled.div`
    /* max-height: 800px; */
    
    img{
        width: 100%;
        height: 200px;
    }
`
const CancelModalBody = () => {
    
    return(
        <BodyContainer>
            <div>
                <div>
                    <img src={iconCancel1}/>
                    <p>1. 로그인 후 예매내역을 선택합니다</p>
                </div>
                <div>
                    <img src={iconCancel2}/>
                    <p>2. 예매내역에서 취소를 원하는 공연의 상세보기를 클릭합니다.</p>
                </div>
                <div>
                    <img src={iconCancel3}/>
                    <p>3. 선택하신 정보가 맞으시다면, 결제 취소하기 버튼을 눌러 진행합니다.</p>
                </div>
            </div>
        </BodyContainer>
    );
}

export default CancelModalBody;