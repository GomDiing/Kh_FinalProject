import { useState } from "react";
import styled from "styled-components";

const PosterCategoryContainer = styled.div`
    width: 100%;
    margin: 30px 0;
    .PosterTitle{
        margin: 5px;
    }
    h2{
        display: inline-block;
        font-size: 1.5em;
        font-weight: bold;
        margin: 0 1 0px;
    }
    li{
        font-size: 1.2em;
        display: inline-block;
        list-style: none;
        border-radius: 10px;
        padding :0.5em;
        cursor: pointer;
        transition: all 0.4s;
        margin: 0 5px;
    }
    li:hover{
        background-color: #86868b;
        color: white;
    }
    `

const categories = [
        {
            name : 'musical',
            text : '뮤지컬'
        },
        {
            name : 'classic',
            text : '클래식 / 무용'
        },
        {
            name : 'act',
            text : '연극'
        },
        {
            name : 'show',
            text : '전시회'
        }
    ]

const PosterCategory = (props) =>{
    const [category , setCategory] = useState('musical');
    const onSelect = (e) =>{
        setCategory(e)
    }
    return(
        <PosterCategoryContainer>
            <div className="PosterTitle">
                <h2>{props.name}</h2>
            {categories.map(c=>(
                <li 
                    key={c.name}
                    active={category === c.name}
                    // ER
                    onClick={()=>onSelect(c.name)}
                >{c.text}</li>
            ))}
            </div>
        </PosterCategoryContainer>
    )
}
export default PosterCategory;