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
    const [loactionObj, setLocationObj] = useState(props.loc2);
    console.log(props.loc2);

    useEffect(() => {
        setLocationObj(props.loc2);

        // const getLocation = () => {
        //     axios.get(`https://dapi.kakao.com/v2/local/search/address.json?query=${loactionObj}`, {
        //         headers: { Authorization: `934ae165a79158f678f698486cff5269` },
        //     })
        //         .then(res => {
        //             const location =res.data.documents[0];
        //             setLocationObj({
        //                 si:location.address.region_1depth_name,
        //                 gu:location.address.region_2depth_name,
        //                 dong:location.address.region_3depth_name,
        //                 locationX:location.address.x,
        //                 locationY:location.address.y,
        //             })
        //         })
        // }
        // getLocation();

        var container = document.getElementById('map');
        var options = {
            center: new kakao.maps.LatLng(33.450701, 126.570667),
            level: 3
        };
    
        var map = new kakao.maps.Map(container, options,);
        var markerPosition = new kakao.maps.LatLng(33.450701, 126.570667);
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

