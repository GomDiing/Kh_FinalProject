import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import WishLikeApi from '../../../../api/WishLikeApi';
import GridCards2 from '../../Cards/GridCards2';

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
            {wishLish && wishLish.map((list, index) => (
            <React.Fragment key={index}>
            <GridCards2 image={list.thumb_poster_url} title={list.product_title} />
            </React.Fragment>
            ))}
        </>
    )
}

export default WishList;