import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Rate } from 'antd';
import WishBt from './WishBt';

const PosterStyle = styled.div `
.summary-top {
    text-align: center;
    word-wrap: break-word;
    max-width: 500px;
}
.posterConta {
    text-align: center;
}
.poster-box-top {
    margin: 18px 0;
}
.poster-box-bottom {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}
@media (max-width: 1225px) {
    .poster-box-bottom {
        width: 500px;
        min-width: 500px;
    }
}
`;

// 상세페이지 상단 포스터
function Poster(props) {
    // const item_name = '태양의서커스 <뉴 알레그리아>';

    // 찜하기
    const [isWishAdd, setIsWishAdd] = useState(false);
    const [like, setLike] = useState(false);

    const wishAddHandler = () => {
        setIsWishAdd(!isWishAdd)
    }

    useEffect(() => {
        setValue(props.rate);
    }, [props.rate])

    const wishHandler = async (e) => {
        wishAddHandler()
        // const res = await DetailApi.axios.postWish
        // 사용자가 찜하기를 누름 -> DB 갱신
        setLike(!like);
    }


    // 별점
    const [value, setValue] = useState(props.rate);
    const handleChange = (value) => {
        setValue(value);
    }

    return (
        <PosterStyle>
        <h3 className='summary-top'>{props.title}</h3>
            <div className='summary-body'>
                <div className='poster-box' style={{margin: '0'}}>
                    <div className='posterConta'>
                        <img className='poster-box-top' src={props.image} alt='포스터 이미지'/>
                            <div className='poster-box-bottom'>
                                <div>
                                    <Rate allowHalf value={value} onChange={handleChange} style={{ fontSize: '1.8rem'}}/>
                                    <span style={{marginLeft: '6px', fontSize: 'medium'}}>{value}</span>
                                </div>
                                <div>
                                    <WishBt like={like} onClick={wishHandler}/>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </PosterStyle>
    )
}

export default Poster;