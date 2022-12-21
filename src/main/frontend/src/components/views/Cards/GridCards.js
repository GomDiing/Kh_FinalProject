import React, { useEffect, useState } from 'react';

import NowLoading from '../../../util/Loading';
import xbox from "../../../images/sad.jpg";
// import { Col } from 'react-bootstrap';

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
        <div style={{ marginTop: '1rem', marginLeft: '3rem', zIndex: '-1'}}>
        <div lg={6} md={8} xs={24}  style={{paddingBottom: '10px'}}>
            <div>
            {/* 렌더링 전 로딩중일시 보이게 */}
            {Loading && <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><NowLoading/></div>}
            <a href={props.url}><img style={{ width: '200px', height: '250px', border: '2px solid blue'}} src={props.image} onError={onErrorImg} alt=""/></a>
            </div>
            <div style={{width: '240px'}} >
            {/* 배우이름과 배역 */}
            <b style={{color: 'blue'}}>{props.actor} </b>
            <br/><b style={{color: 'black'}} >as </b><b style={{color: 'red'}}>{props.character}</b></div>
        </div>
        </div>
    );
}

export default GridCards;