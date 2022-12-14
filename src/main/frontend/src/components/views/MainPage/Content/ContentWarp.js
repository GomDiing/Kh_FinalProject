import styled from "styled-components";
import Carousel from 'react-bootstrap/Carousel';

const BackContainer = styled.div`
    img{
        width: 100%;
        height: 35vh;
        /* min-height: 170px; */
    }
    @media (max-width : 1023px){
        img{
            height: 15vh;
        }
    }
`
    const mainWrap = [
        {
            name : "1",
            img : "http://ticketimage.interpark.com/TCMS4/Main/202211/MainVisual_ecf029f1-3a95-4544-ba7e-89b07a69006c.jpg"
        },
        {
            name : "2",
            img : "http://ticketimage.interpark.com/TCMS4/Main/202207/MainVisual_b4b74e9a-640d-422f-ba51-d98b494e07a1.jpg"
        },
        {
            name : "3",
            img : "http://ticketimage.interpark.com/TCMS4/Main/202202/MainVisual_059f5f0e-3477-4c7f-95a4-bdc6e5e0c887.jpg"
        }
    ]

const ContentWarp = () =>{
    return(
        <BackContainer>
            <Carousel fade>            
                {mainWrap.map(c=>(
                <Carousel.Item>
                    <img 
                        key={c.name}
                        src={c.img}
                    alt=''></img>
                </Carousel.Item>
                ))}
            </Carousel>            
        </BackContainer>
    )
}
export default ContentWarp;