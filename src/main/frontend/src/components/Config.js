export const REST_API_KEY = '934ae165a79158f678f698486cff5269'
export const REDIRECT_URI = 'http://localhost:8100/login/oauth2/code/kakao'
export const ADMIN_KEY = '611894ef23891a87f66d8b38e68bf6fd';
export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=login`
export const GOOGLE_URL = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?scope=profile%20email%20openid&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8100%2Fgoogle%2Flogin%2Fredirect&client_id=378869361700-occ5ie1gu0m115637dubtrvs9irt9u6e.apps.googleusercontent.com&service=lso&o2v=2&flowName=GeneralOAuthFlow'