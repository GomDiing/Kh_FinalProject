import { Link } from "react-router-dom";


function ResultFalse () {
    return(
        <div>
            <h2>결제 실패 하였습니다.</h2>
            <Link to='/'>메인으로 돌아가기</Link>
        </div>
    );
}

export default ResultFalse;