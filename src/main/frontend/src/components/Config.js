// export const REST_API_KEY = '934ae165a79158f678f698486cff5269'
export const REST_API_KEY = 'c70e636c70620385df472f55c15b0e50'

// KAKAO 배포용
export const KAKAO_REDIRECT_URI = 'https://tcats.site/login/oauth2/code/kakao'
// KAKAO 개발용 (localhost)
// export const KAKAO_REDIRECT_URI = 'http://localhost:8100/login/oauth2/code/kakao'

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code&prompt=login`


// KAKAO PAY 배포용
// export const KAKAO_PAY_APPROVAL = 'http://localhost:8100/payresult'
// export const KAKAO_PAY_FAIL = 'http://localhost:8100/resultfalse'
// export const KAKAO_PAY_CANCEL = 'http://localhost:8100/resultfalse'

// KAKAO PAY 개발용 (localhost)
export const KAKAO_PAY_APPROVAL = 'https://tcats.site/payresult'
export const KAKAO_PAY_FAIL = 'https://tcats.site/resultfalse'
export const KAKAO_PAY_CANCEL = 'https://tcats.site/resultfalse'



// GOOGLE 배포용
export const GOOGLE_REDIRECT_URI = 'https%3A%2F%2Ftcats.site'
// GOOGLE 개발용 (localhost)
// export const GOOGLE_REDIRECT_URI = 'http%3A%2F%2Flocalhost%3A8100'
// export const GOOGLE_URL = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?scope=profile%20email%20openid&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8100%2Fgoogle%2Flogin%2Fredirect&client_id=378869361700-4fvmngl6ce5b8d690gno3s3kgnf7eoku.apps.googleusercontent.com&service=lso&o2v=2&flowName=GeneralOAuthFlow'
export const GOOGLE_URL = `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?scope=profile%20email%20openid&response_type=code&redirect_uri=${GOOGLE_REDIRECT_URI}%2Fgoogle%2Flogin%2Fredirect&client_id=378869361700-4fvmngl6ce5b8d690gno3s3kgnf7eoku.apps.googleusercontent.com&service=lso&o2v=2&flowName=GeneralOAuthFlow`

// export const ADMIN_KEY = '611894ef23891a87f66d8b38e68bf6fd';
// export const SECRET_KEY = 'PRD6F96DDC254169EA61A4C9FF0C9E463121D70E';
export const SECRET_KEY = 'DEVF0502E6E5412BFA434ACBD77DF29A1742499A';

// export const TCATS_DOMAIN = 'https://tcats.site'
// export const TCATS_DOMAIN = 'http://localhost:8100'
// export const GOOGLE_URL = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?scope=profile%20email%20openid&response_type=code&redirect_uri=https%3A%2F%2Ftcats.tk%3A8100%2Fgoogle%2Flogin%2Fredirect&client_id=378869361700-4fvmngl6ce5b8d690gno3s3kgnf7eoku.apps.googleusercontent.com&service=lso&o2v=2&flowName=GeneralOAuthFlow'
