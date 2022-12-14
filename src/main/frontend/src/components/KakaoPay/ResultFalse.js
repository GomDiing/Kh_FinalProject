import { Link } from "react-router-dom";


function ResultFalse () {
    return(
        <div>
            <h2>결제 실패 페이지입니다.</h2>
            <Link to='/'>메인으로 가기</Link>
        </div>
    );
}

export default ResultFalse;