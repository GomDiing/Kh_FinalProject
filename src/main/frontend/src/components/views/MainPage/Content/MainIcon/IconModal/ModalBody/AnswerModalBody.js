import { useState } from "react";
import styled from "styled-components"
const BodyContainer = styled.div`
    table{
        border-bottom:1px solid silver;
    }
    td{
        cursor: pointer;
        width: 600px;
        height: 40px;
        border-bottom: 1px solid silver;
    }
    th{
        width: 100px;
        text-align: center;
        border-bottom:1px solid silver;
    }
    .answer{
        margin: 20px;
        background-color: #f5f5f5;
    }
    .answerTitle{
        font-size: 18px;
        font-weight: bold;
    }
    .answerAccent{
        color: rgb(0, 128, 0);
    }
    p{
        font-size: 16px;
    }
    .strong{
        color : #cc0000;
    }    
`

const AnswerModalBody = () => {
    const [isContents , setIsConstents] = useState(0)

    const ListClick = (e) =>{
        setIsConstents(e)
        console.log(isContents)
    }

    return(
        <BodyContainer>
            <div className='BuyOption'>
                <table>
                    <tr>
                        <th>유형</th>
                        <th>제목</th>
                    </tr>
                    <tr >
                        <th rowSpan={3}>티켓예매<br></br>발권</th>
                        <td onClick={()=>{ListClick(1)}}>공연 예매가 가능한 결제수단은 어떤 것들이 있나요?</td>
                    </tr>
                    <tr><td onClick={()=>{ListClick(2)}}>결제가 완료 되었다는데 예매 내역이 없어요</td></tr>
                    <tr><td onClick={()=>{ListClick(3)}}>공연 예매 후 관람일시, 좌석을 변경할 수 있나요?</td></tr>
                </table>
            </div>
            <div className="answer">
                {isContents === 1 && 
                <div className="answerContainer">
                    <p className="answerTitle">T-Cat 예매 시 이용이 가능한 결제수단은 아래와 같습니다.</p>
                    <p className="answerAccent">T-Cat 홈페이지에서는 <span className="strong"> 카카오 페이</span>를 이용한 결제방식만 지원하고 있으며, 추후 다른 결제 시스템을 도입할 예정이오니 참고 부탁드립니다.</p>
                    <p>다만, 대형 공연 또는 경기의 티켓 예매 오픈 시간에는 많은 고객님들의 접속으로 인해 서버가 불안정하여
                    원할한 예매를 위해 일시적으로 결제수단은 이용에 제한이 있습니다.</p>
                </div>}

                {isContents === 2 && 
                <div className="answerContainer">
                    <p className="answerTitle">동시 접속 수가 많은 대형 공연은 좌석 선택 중복건이 다수 발생할 수 있습니다.</p>
                    <p className="answerAccent">
                        이런 경우에는 결제를 먼저 완료하신 고객님께서 좌석 확보가 진행되므로
                        결제단계에서 다른 고객이 선택하신 좌석을 먼저 예매하는 경우가 있습니다.
                    </p>
                    <p>
                        결제가 되었다는 메시지를 받으셨더라도 홈페이지의 <span className="strong">[예매내역]</span>에서 정상 예매되었는지
                        꼭 확인해 주시기 바랍니다.
                    <br></br>
                        만약, 예매는 이루어지지 않고 결제만 완료가 되었다면  자동으로 취소가 진행되나,
                        빠른 취소를 원하신다면 예매자 본인께서 <span className="strong">1:1문의하기</span>로 연락해 주시기 바랍니다.</p>
                </div>
                }
                {isContents === 3 && 
                <div className="answerContainer">
                    <p className="answerTitle">예매 후 공연 관람일시, 좌석을 변경하고 싶다면, 예매된 내역을 취소하신 후 재 예매를 하셔야 합니다.
                        (예매 내역 취소 시에는 예매수수료, 취소수수료가 T-Cat 기준에 의해 발행하게 됩니다.)</p>
                    <p className="answerAccent">
                        ▶ 질문
                        예매내역의 관람일시를 변경하고 싶은데 방법이 있나요?
                    </p>
                    <p>
                        <span className="strong">예매 완료 후 예매 시 선택한 관람일시를 변경할 수 없습니다.</span>
                        관람일만 변경을 원하는 경우 이미 예매한 예매내역 취소 후 재 예매를 시도하셔야 합니다.
                        예매내역을 취소하는 경우 예매수수료, 취소수수료는 T-Cat 기준으로 동일하게 발생됩니다.
                    </p>
                </div>
                }
            </div>
        </BodyContainer>
    );
}

export default AnswerModalBody;