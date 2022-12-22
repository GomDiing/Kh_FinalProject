// import React, { useEffect } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { REST_API_KEY, REDIRECT_URI } from '../Config'

// const KakaoLogin = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const KakaoAccInfo = location.search
//     console.log(KakaoAccInfo);
//     let params = new URLSearchParams(KakaoAccInfo);
//     let kEmail = params.get('email');
//     console.log(kEmail);
//     let ckJoin = params.get('isJoin');
//     console.log(ckJoin);

//     const getKakaoToken = () => {
//     fetch(`https://kauth.kakao.com/oauth/token`, {
//         method: 'POST',
//         headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//         body: `grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${KAKAO_CODE}`,
//     })
//     .then(res => res.json())
//     .then(data => {
//         if(data.access_token) {
//             localStorage.setItem('token', data.access_token);
//         } else {
//             navigate('/');
//         }
//     });
// };


//     useEffect(() => {
//         if(!location.search) return;
//         getKakaoToken();
//     }, []);

// return (
//     <div>
//         KakaoLogin
//     </div>
// )
// }

// export default KakaoLogin;