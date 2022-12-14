import styled from "styled-components"
import { useEffect } from "react"
/*global kakao*/

const MapModalBodyContainer = styled.div`

`

const MapModalBody = () =>{
    useEffect(() => {
        var container = document.getElementById('map');
        var options = {
            center: new kakao.maps.LatLng(37.31769736304275, 126.83974503891676),
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
            <div className="right_text">
                <div id="map" style={{ width: "500px", height: "400px", textAlign: "center", justifyContent: "center", margin: "auto", display: "block" }}></div>
            </div>
        </MapModalBodyContainer>
    )
}

export default MapModalBody