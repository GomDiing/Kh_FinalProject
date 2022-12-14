import React from 'react';

// 구현중
function KakaoAccInfo() {
    const ACCESS_TOKEN = window.localStorage.getItem('token');
    const getKakaoInfo = () => {
        fetch(`https://kapi.kakao.com/v2/user/me`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
        .then(response => response.json())

    }
    return (
    <div>

    </div>
    )
}

export default KakaoAccInfo;