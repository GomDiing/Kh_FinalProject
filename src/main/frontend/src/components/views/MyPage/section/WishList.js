import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import WishLikeApi from '../../../../api/WishLikeApi';
import GridCards2 from '../../Cards/GridCards2';

const NoresultContainer = styled.div`
    width: 100%;
    img{
        width: 400px;
        height: 280px;
    }
    .Content{
        display: block;
        .item{
            display: flex;
            justify-content: center;
            p{
                font-size: 23px;
                margin-top: 20px;
            }
        }
    }
`

function WishList() {
    const [wishLish, setWishList] = useState('')
    const userInfo = useSelector((state) => state.user.info);

    useEffect(() => {
        const getList = async() => {
            try {
                const res = await WishLikeApi.wishList(userInfo.userIndex);
                if(res.data.statusCode === 200) {
                    setWishList(res.data.results);
                } else {
                alert("리스트 조회가 안됩니다.")
                } 
            } catch (e) {
                console.log(e);
            }
            };
            getList();
        }, [userInfo.userIndex]); 

    return (
        <>
        {wishLish.length === 0 ? 
                <NoresultContainer>
                <div className="Content">    
                    <div className="item"><img src={process.env.PUBLIC_URL + '/images/TCAT_02.png'} alt=''></img></div>
                    <div className="item"><p>검색 결과가 없습니다.</p></div>
                </div>
                </NoresultContainer>
                :
                <>
                {wishLish && wishLish.map((list, index) => (
                    <React.Fragment key={index}>
                    <GridCards2 image={list.thumb_poster_url} title={list.product_title} code={list.product_code}/>
                    </React.Fragment>
                    ))}
                </>
        }
        </>
        )
    }

export default WishList;