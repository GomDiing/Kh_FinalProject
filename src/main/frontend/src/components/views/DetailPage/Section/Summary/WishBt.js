import styled from "styled-components";
import HeartImg from "../../../../../images/heart.png";
import EmptyHeartImg from "../../../../../images/empty-heart.png";

const Heart = styled.img`
width: 20px;
height: 20px;
`;
// 찜하기 버튼
const WishBt = ({ like, onClick }) => {
    return (
        <Heart src={like?HeartImg:EmptyHeartImg} onClick={onClick} />
    );
};

export default WishBt;