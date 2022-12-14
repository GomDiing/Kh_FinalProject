import styled from "styled-components"
import { useEffect } from "react"
/*global kakao*/

const MapModalBodyContainer = styled.div`
    .Map{
        margin: 0 auto;
        
    }
`

const MapModalBody = (props) =>{
    useEffect(() => {
        var container = document.getElementById('map');
        var options = {
            center: new kakao.maps.LatLng(37.31123213275, 126.83214503891676),
            level: 3
        };
    
        var map = new kakao.maps.Map(container, options,);
        var markerPosition = new kakao.maps.LatLng(37.31769736304275, 126.83974503891676);
        var marker = new kakao.maps.Marker({
            title: '미정',
            position: markerPosition,
        });
        marker.setMap(map);

    }, [])

    return(
        <MapModalBodyContainer>
                <div className="Map" id="map" style={{ width: "700px", height: "600px"}}></div>
        </MapModalBodyContainer>
    )
}

export default MapModalBody