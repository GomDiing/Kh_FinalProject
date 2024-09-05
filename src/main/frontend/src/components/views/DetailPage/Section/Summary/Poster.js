import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Rate } from 'antd';
import WishBt from './WishBt';
import WishLikeApi from '../../../../../api/WishLikeApi';
import { useSelector } from 'react-redux';

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
    const userInfo = useSelector((state) => state.user.info)
    // 별점
    let [value, setValue] = useState(props.rate);
    const [pCode, setPcode] = useState(props.code);
    
    // 찜하기
    const [isWishAdd, setIsWishAdd] = useState(false);
    const [wishCount, setWishCount] = useState(1);
    const [like, setLike] = useState(false);

    const wishAddHandler = () => {
        setIsWishAdd(!isWishAdd)
    }
console.log(props.rate);
    useEffect(() => {
        setPcode(props.code);
        round();
    }, [props.code])

    const round = () => {
        value = Math.ceil(props.rate * 10) / 10;
        setValue(value)
    };


    const wishHandler = async () => {
        wishAddHandler();
        if(!isWishAdd) {
            setWishCount(wishCount + 1);
            try {
                const res = await WishLikeApi.addWish(userInfo.userIndex, pCode);
                if(res.data.statusCode === 200) {
                    setLike(true);
                    console.log(res.data.message);
                } else {
                    alert("에러 1")
                }
            } catch (e) {
                console.log(e);
                if(e.response.data.statusCode === 400) {
                    alert("로그인 후 이용해주세요.")
                } else {
                    console.log("Error")
                }
            }
        } else if(isWishAdd) {
            setWishCount(wishCount -1);
            try {
                const res = await WishLikeApi.cancelWish(userInfo.userIndex, pCode);
                if(res.data.statusCode === 200) {
                    setLike(false);
                } else {
                    alert("에러 2")
                }
            } catch (e) {
                if(e.response.data.statusCode === 400) {
                    alert("로그인 후 이용해주세요.")
                } else {
                    console.log("Error")
                }
            }
        }
    }
    console.log(value);


    return (
        <PosterStyle>
        <h3 className='summary-top'>{props.title}</h3>
            <div className='summary-body'>
                <div className='poster-box' style={{margin: '0'}}>
                    <div className='posterConta'>
                        <img className='poster-box-top' src={props.image} alt='포스터 이미지'/>
                            <div className='poster-box-bottom'>
                                <div>
                                    <Rate allowHalf value={props.rate} style={{ fontSize: '1.8rem'}}/>
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