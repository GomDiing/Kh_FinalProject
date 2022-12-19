import styled from "styled-components";
import Carousel from 'react-bootstrap/Carousel';
import { storage } from "../../../AdminPage/Tool/Firebase";
import {ref,listAll, getDownloadURL} from "firebase/storage";
import { useEffect, useState } from "react";

const BannerContainer = styled.div`
    width: 100%;
    height: 120px;

    .CarouselContainer{
        button,span{
            display: none;
        }

    }
    img{
        width: 100%;
        height: 120px;
    }
    @media (max-width : 1024px){
        height: 160px;
    }
`

const MainBanner = () =>{
    const [imageList, setImageList] =useState([]);
    useEffect(()=>{
        const imageListReg=ref(storage,"image/");
        listAll(imageListReg).then((response)=>{
            response.items.forEach((item)=>{
                getDownloadURL(item).then((url)=>{
                    setImageList((prev)=>[...prev,url])
                })
            })
        })
    },[])

    return(
        <BannerContainer>            
            <Carousel fade className="CarouselContainer">            
                {imageList.map((imageList , index)=>(
                <Carousel.Item>
                    <img 
                        key={index}
                        src={imageList}
                    alt=''></img>
                </Carousel.Item>
                ))}
            </Carousel>
        </BannerContainer>
    )
}

export default MainBanner