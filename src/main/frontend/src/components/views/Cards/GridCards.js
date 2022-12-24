import React, { useEffect, useState } from 'react';
import NowLoading from '../../../util/Loading';
import xbox from "../../../images/sad.jpg";

// 상세 페이지 배우 사진용 그리드카드
function GridCards(props) {
    // 로딩중
    const [Loading, setLoading] = useState(true);
    useEffect(() => { setLoading(false) }, []);
    // 이미지 없을시 아이콘 처리
    const onErrorImg = (e) => {
        e.target.src = xbox;
    }
    return (
        
        <div style={{ zIndex: '-1' , display : 'inline-block' , margin : '20px' }}>
        <div >
            <div>
            {/* 렌더링 전 로딩중일시 보이게 */}
            {Loading && <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><NowLoading/></div>}
            <a href={props.url}><img style={{ width: '200px', height: '250px' , padding : '5px'}} src={props.image} onError={onErrorImg} alt=""/></a>
            </div>  
            <div style={{ textAlign : 'center'}} >
                {/* 배우이름과 배역 */}
                <br/><b style={{color: 'black'}}>{props.character}</b>
                <b style={{color: '#9E9E9E'}}>{props.actor}</b>
            </div>
        </div>
        </div>
    );
}

export default GridCards;