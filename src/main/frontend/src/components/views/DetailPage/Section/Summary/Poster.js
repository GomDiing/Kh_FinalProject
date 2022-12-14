import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Rate } from 'antd';
import WishBt from './WishBt';

const PosterStyle = styled.div `
    .poster-box-bottom{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 10px;
    }
    @media (max-width:1024px){
        .poster-box-bottom{
            margin-right: 80px;
        }
    }
`;

// 상세페이지 상단 포스터
function Poster(props) {
    const item_name = '태양의서커스 <뉴 알레그리아>';

    // 찜하기
    const [isWishAdd, setIsWishAdd] = useState(false);
    const [like, setLike] = useState(false);

    const wishAddHandler = () => {
        setIsWishAdd(!isWishAdd)
    }

    // useEffect(async () => {
    //     const fetchData = async () => {
    //         const res = await DetailApi.axios.getWish
    //         if (res.data.type === 'liked') setLike(true)
    //     }
    //     fetchData()
    // }, []);

    const wishHandler = async (e) => {
        wishAddHandler()
        // const res = await DetailApi.axios.postWish
        // 사용자가 찜하기를 누름 -> DB 갱신
        setLike(!like);
    }


    // 별점
    const [value, setValue] = useState(3);
    function handleChange(value) {
        setValue(value);
    }

    return (
        <PosterStyle>
        <h3 className='summary-top'>{item_name}</h3>
            <div className='summary-body'>
                <div className='poster-box' style={{margin: '0'}}>
                    <div className='posoterConta'>
                        <img className='poster-box-top' src='test.gif' alt='포스터 이미지'/>
                            <div className='poster-box-bottom'>
                                <div>
                                    <Rate allowHalf value={value} onChange={handleChange} style={{ fontSize: '1.8rem'}}/>
                                    <span>{value}</span>
                                </div>
                                <div style={{marginRight:'20px'}}>
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