import React, { useEffect, useState } from 'react';
import NowLoading from '../../../util/Loading';
import xbox from "../../../images/sad.jpg";
import { Link } from 'react-router-dom';

// 찜목록
function GridCards2(props) {
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
            {Loading && <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><NowLoading/></div>}
            <Link to={`/detail/${props.code}`} >
                <img style={{ width: '200px', height: '250px'}} src={props.image} onError={onErrorImg} alt=""/>
            </Link>
            </div>
            <div style={{width: '240px'}} >
            <b style={{color: 'black'}}>{props.title}</b>
            </div>
        </div>
        </div>
    );
}

export default GridCards2;