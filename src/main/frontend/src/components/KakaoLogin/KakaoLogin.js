// import React, { useEffect } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { REST_API_KEY, REDIRECT_URI } from '../Config'

// function KakaoLogin() {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const KAKAO_CODE = location.search.split('=')[1];

//     const getKakao = () => {
//     fetch(`KAKAO_AUTH_URL`)
//     .then(res => console.log(res.header))
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