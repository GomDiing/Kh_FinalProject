import styled from "styled-components";
import Carousel from 'react-bootstrap/Carousel';

const BackContainer = styled.div`
    img{
        width: 100%;
        height: 40vh;
        /* min-height: 170px; */
    }
    @media (max-width : 1440px){
        img{
        height: 450px;
        }
    }
`
    const mainWrap = [
        {
            name : "1",
            img : "http://tkfile.yes24.com/Upload2/Display/202211/20221110/wel_mv_44048.jpg/dims/quality/70/"
        },
        {
            name : "2",
            img : "http://tkfile.yes24.com/Upload2/Display/202212/20221222/wel_mv_40196.jpg/dims/quality/70/"
        },
        {
            name : "3",
            img : "http://tkfile.yes24.com/Upload2/Display/202211/20221104/wel_mv_43948.jpg/dims/quality/70/"
        },
        {
            name : "4",
            img : "http://tkfile.yes24.com/Upload2/Display/202211/20221121/wel_mv_44163.jpg/dims/quality/70/"
        },
        {
            name : "5",
            img : "http://tkfile.yes24.com/Upload2/Display/202212/20221215/wel_mv_44374.jpg/dims/quality/70/"
        },
    ]

const ContentWarp = () =>{


    return(
        <BackContainer>
            <Carousel fade>            
                {mainWrap.map((mainWrap , index)=>(
                <Carousel.Item key={index}>
                    <img src={mainWrap.img} alt=''></img>
                </Carousel.Item>
                ))}
            </Carousel>            
        </BackContainer>
    )
}
export default ContentWarp;