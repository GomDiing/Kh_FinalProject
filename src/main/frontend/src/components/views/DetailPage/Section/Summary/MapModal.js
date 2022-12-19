import styled from "styled-components"
import { useEffect, useState } from "react"
import axios from "axios"
/*global kakao*/

const MapModalBodyContainer = styled.div`
    .Map{
        margin: 0 auto;
    }
`

const MapModalBody = (props) =>{
    const [loactionObj, setLocationObj] = useState(props.dloc);
    console.log(props.dloc);

    const getLocation = () => {
        axios.get(`https://dapi.kakao.com/v2/local/search/address.json?query=${loactionObj}`, {
            headers: { Authorization: `eea39e4715c0bc716e82b502b5976243` },
        })
            .then(res => {
                const location =res.data.documents[0];
                setLocationObj({
                    si:location.address.region_1depth_name,
                    gu:location.address.region_2depth_name,
                    dong:location.address.region_3depth_name,
                    locationX:location.address.x,
                    locationY:location.address.y,
                })
            })
    }

    useEffect(() => {
        var container = document.getElementById('map');
        var options = {
            center: new kakao.maps.LatLng(loactionObj.locationX, loactionObj.locationY),
            level: 3
        };
    
        var map = new kakao.maps.Map(container, options,);
        var markerPosition = new kakao.maps.LatLng(loactionObj.locationX, loactionObj.locationY);
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

export default MapModalBody;