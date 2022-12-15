import styled from "styled-components";
import Carousel from 'react-bootstrap/Carousel';

const BannerContainer = styled.div`
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    margin-bottom:20px;

    img{
        width: 100%;
        height: 120px;
    }
    @media (max-width : 1024px){
        img{
        height: 160px;
    }
    }
`

const banner = [
    {
        id : "1",
        img : "http://ticketimage.interpark.com/TCMS4/Main/202201/MainBarBanner_MainBarBanner2_051830fe-ed49-45d8-9c67-377833cac313.jpg"
    },
    // {   
    //     id : "2",
    //     img : "http://ticketimage.interpark.com/TCMS4/Main/202206/MainBarBanner_MainBarBanner2_d77acc80-f1ca-4d8c-bffe-3c308e3642c3.jpg"
    // }
]

const MainBanner = (props) =>{

    return(
        <BannerContainer>            
            {/* <Carousel fade> */}
                {banner.map(c =>(
                    // <Carousel.Item>
                    <img
                        key={c.id}
                        src={c.img}
                        alt=""
                    ></img>
                    // </Carousel.Item>
                ))}        
            {/* </Carousel> */}
        </BannerContainer>
    )
}

export default MainBanner