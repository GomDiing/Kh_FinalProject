import { useState } from "react";
import styled from "styled-components";

const PosterCategoryContainer = styled.div`
    width: 100%;
    margin: 30px 0;
    /* border: solid 1px black; */
    .PosterTitle{
        display: flex;
        justify-content: center;        
    }
    li{
        display: flex;
        justify-content: center;
        border-radius: 10px;
        min-width: 120px;
        font-size: 1.2em;
        list-style: none;
        padding : 0.5em;
        margin: 0 1em;
        cursor: pointer;
        transition: all 0.4s;
    }
    li:hover{
        background-color: #86868b;
        color: white;
    }
    `

const categories = [
        {
            name : 'popularity',
            text : '인기공연'
        },
        {
            name : 'concert',
            text : '공연장공연'
        },
        {
            name : 'soon',
            text : '개막예정'
        },
        {
            name : 'comming',
            text : '종료임박'
        }
    ]

const PosterCategory2 = () =>{
    const [category , setCategory] = useState('popularity');
    const onSelect = (e) =>{
        setCategory(e)
    }
    // console.log(category)
    return(
        <PosterCategoryContainer>
            <div className="PosterTitle">
            {categories.map(c=>(
                <li 
                    key={c.name}
                    active={category === c.name}
                    onClick={()=>onSelect(c.name)}
                >{c.text}</li>
            ))}
            </div>
        </PosterCategoryContainer>
    )
}
export default PosterCategory2;