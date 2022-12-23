import styled from "styled-components";

const TopBlock=styled.div`
    .tarContainer{
        border: none;
        margin: 30px 10px;
        background-color: #92A9BD;
        border-radius: 5px;
        width: 15vw;
        height: 50px;
        display : flex;
        justify-content : center;
        align-items : center;
    }
`;
const TopBar=(props)=>{
    return(
        <TopBlock>
        <div className="tarContainer">
            <div className="title">{props.name}</div>
        </div>
        </TopBlock>
    );
}
export default TopBar;