
/*global kakao*/
import styled from "styled-components"
import { useEffect, useState } from "react"

const MapModalBodyContainer = styled.div`
    .Map{
        div{
            margin: 0;
        }
        padding: 0;
        margin-top: 0;
        margin-bottom: 50px;
    }
    main {
        padding: 0;
    }
    .title {
        margin-left: 8px;
        margin-top: 25px;
        font-weight: bold;
    }

`
const { kakao } = window;

const MapModalBody = (props) =>{
    const [loactionObj, setLocationObj] = useState(props.loc2);
    const [mapL, setMapL] = useState('');
    console.log(props.loc2);

    const getLocation = () => {
        fetch(`https://dapi.kakao.com/v2/local/search/address.json?analyze_type=similar&page=1&size=10&query=${loactionObj}`, {
            headers: { Authorization: "KakaoAK 934ae165a79158f678f698486cff5269" },
            method: 'GET'
        })
        .then(res => res.json())
        .then(res => {
            setMapL(res.documents[0].road_address)
        })
    }

    useEffect(() => {
        setLocationObj(props.loc2);
        getLocation();
        var mapContainer = document.getElementById('map'),
        mapOption = {
            center: new kakao.maps.LatLng(mapL.y, mapL.x),
            level: 2
        };
        var map = new kakao.maps.Map(mapContainer, mapOption);
        var imageSrc = 'https://ifh.cc/g/H7DtZR.png',
        imageSize = new kakao.maps.Size(36, 36),
        imageOption = {offset: new kakao.maps.Point(27, 69)};

        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
            markerPosition = new kakao.maps.LatLng(mapL.y, mapL.x);

        var marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage
        });

        marker.setMap(map);  

    }, [mapL.y, mapL.x])

    return(
        <MapModalBodyContainer>
            <div className="Map" id="map" style={{ width: "665px", height: "500px"}}></div>
        </MapModalBodyContainer>
    )
}

export default MapModalBody;

