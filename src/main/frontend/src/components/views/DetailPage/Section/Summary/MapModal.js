
/*global kakao*/
import styled from "styled-components"
import {useEffect, useRef, useState} from "react"
import iconMapPosition from "../../../../../images/map_position.png"
import {REST_API_KEY} from "../../../../Config";

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
/*

const { kakao } = window;

const MapModalBody = (props) =>{
    const [loactionObj, setLocationObj] = useState(props.loc2);
    const [mapL, setMapL] = useState('');
    console.log(props.loc2);

    const getLocation = () => {
        fetch(`https://dapi.kakao.com/v2/local/search/address.json?analyze_type=similar&page=1&size=10&query=${loactionObj}`, {
            headers: { Authorization: "KakaoAK c70e636c70620385df472f55c15b0e50" },
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
        // var imageSrc = 'https://ifh.cc/g/H7DtZR.png',
        var imageSrc = iconMapPosition,
        imageSize = new kakao.maps.Size(42, 42),
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
*/


// const MapModalBody = (props) => {
/*
function MapModalBody({ loc2 }) {
    const [locationObj, setLocationObj] = useState(loc2);
    const [mapL, setMapL] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        console.log("MapModalBody component loc2:", loc2);
    }, [loc2]);

    useEffect(() => {
        if (!loc2) {
            console.log("MapModalBody: loc2 is undefined or null");
            setError("Location data is missing");
            setIsLoading(false);
            return;
        }
        setLocationObj(loc2);
        getLocation();
    }, [loc2]);

    const getLocation = async () => {
        try {
            const response = await fetch(
                `https://dapi.kakao.com/v2/local/search/address.json?analyze_type=similar&page=1&size=10&query=${locationObj}`,
                {
                    headers: { Authorization: `KakaoAK ${REST_API_KEY}` },
                }
            );
            if (!response.ok) throw new Error("Failed to fetch location data");
            const data = await response.json();
            if (data.documents.length === 0) throw new Error("No location data found");
            setMapL(data.documents[0].road_address);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!mapL || isLoading) return;

        const loadKakaoMaps = () => {
            if (window.kakao && window.kakao.maps) {
                initializeMap();
            } else {
                const script = document.createElement('script');
                script.async = true;
                script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${REST_API_KEY}&autoload=false`;
                document.head.appendChild(script);

                script.addEventListener('load', () => {
                    window.kakao.maps.load(initializeMap);
                });
            }
        };

        const initializeMap = () => {
            const mapContainer = document.getElementById("map");
            const mapOption = {
                center: new window.kakao.maps.LatLng(mapL.y, mapL.x),
                level: 2,
            };

            const map = new window.kakao.maps.Map(mapContainer, mapOption);
            mapRef.current = map;

            const markerImage = new window.kakao.maps.MarkerImage(
                iconMapPosition,
                new window.kakao.maps.Size(42, 42),
                { offset: new window.kakao.maps.Point(27, 69) }
            );

            const marker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(mapL.y, mapL.x),
                image: markerImage,
            });

            marker.setMap(map);
        };

        loadKakaoMaps();

        return () => {
            if (mapRef.current) {
                mapRef.current = null;
            }
        };
    }, [mapL, isLoading]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <MapModalBodyContainer>
            <div className="Map" id="map" style={{ width: "665px", height: "500px" }}></div>
        </MapModalBodyContainer>
    );
}

export default MapModalBody;
*/
/*

function MapModalBody({ loc2 }) {
    const [locationObj, setLocationObj] = useState(loc2);
    const [mapL, setMapL] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        console.log("MapModalBody component loc2:", loc2);
    }, [loc2]);

    useEffect(() => {
        if (!loc2) {
            console.log("MapModalBody: loc2 is undefined or null");
            setError("Location data is missing");
            setIsLoading(false);
            return;
        }
        setLocationObj(loc2);
        getLocation();
    }, [loc2]);

    const getLocation = async () => {
        console.log("Fetching location data for:", locationObj);
        try {
            const response = await fetch(
                `https://dapi.kakao.com/v2/local/search/address.json?analyze_type=similar&page=1&size=10&query=${encodeURIComponent(locationObj)}`,
                {
                    headers: { Authorization: `KakaoAK ${REST_API_KEY}` },
                }
            );
            console.log("API Response status:", response.status);
            if (!response.ok) throw new Error("Failed to fetch location data");
            const data = await response.json();
            console.log("API Response data:", data);
            if (data.documents.length === 0) throw new Error("No location data found");
            setMapL(data.documents[0].road_address);
        } catch (err) {
            console.error("Error fetching location:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!mapL || isLoading) return;
        console.log("Initializing map with data:", mapL);

        const loadKakaoMaps = () => {
            if (window.kakao && window.kakao.maps) {
                console.log("Kakao maps already loaded");
                initializeMap();
            } else {
                console.log("Loading Kakao maps script");
                const script = document.createElement('script');
                script.async = true;
                script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${REST_API_KEY}&autoload=false`;
                document.head.appendChild(script);

                script.addEventListener('load', () => {
                    console.log("Kakao maps script loaded");
                    window.kakao.maps.load(initializeMap);
                });
            }
        };

        const initializeMap = () => {
            console.log("Initializing map");
            const mapContainer = document.getElementById("map");
            const mapOption = {
                center: new window.kakao.maps.LatLng(mapL.y, mapL.x),
                level: 2,
            };

            const map = new window.kakao.maps.Map(mapContainer, mapOption);
            mapRef.current = map;

            const markerImage = new window.kakao.maps.MarkerImage(
                iconMapPosition,
                new window.kakao.maps.Size(42, 42),
                { offset: new window.kakao.maps.Point(27, 69) }
            );

            const marker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(mapL.y, mapL.x),
                image: markerImage,
            });

            marker.setMap(map);
            console.log("Map initialized");
        };

        loadKakaoMaps();

        return () => {
            if (mapRef.current) {
                console.log("Cleaning up map reference");
                mapRef.current = null;
            }
        };
    }, [mapL, isLoading]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <MapModalBodyContainer>
            <div className="Map" id="map" style={{ width: "665px", height: "500px" }}></div>
        </MapModalBodyContainer>
    );
}

export default MapModalBody
*/

function MapModalBody({ loc2 }) {
    const [locationObj, setLocationObj] = useState(loc2);
    const [mapL, setMapL] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        console.log("MapModalBody component loc2:", loc2);
        if (loc2) {
            setLocationObj(loc2);
            getLocation();
        } else {
            setError("Location data is missing");
            setIsLoading(false);
        }
    }, [loc2]);

    const getLocation = async () => {
        console.log("Fetching location data for:", locationObj);
        try {
            const response = await fetch(
                `https://dapi.kakao.com/v2/local/search/address.json?analyze_type=similar&page=1&size=10&query=${encodeURIComponent(locationObj)}`,
                {
                    headers: { Authorization: `KakaoAK ${REST_API_KEY}` },
                }
            );
            console.log("API Response status:", response.status);
            if (!response.ok) throw new Error("Failed to fetch location data");
            const data = await response.json();
            console.log("API Response data:", data);
            if (data.documents.length === 0) throw new Error("No location data found");
            setMapL(data.documents[0].road_address);
        } catch (err) {
            console.error("Error fetching location:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!mapL || isLoading) return;
        console.log("Initializing map with data:", mapL);

        const loadKakaoMaps = () => {
            if (window.kakao && window.kakao.maps) {
                console.log("Kakao maps already loaded");
                initializeMap();
            } else {
                console.log("Loading Kakao maps script");
                const script = document.createElement('script');
                script.async = true;
                script.src = `https//dapi.kakao.com/v2/maps/sdk.js?appkey=${REST_API_KEY}&autoload=false`;

                script.onload = () => {
                    console.log("Kakao maps script loaded successfully");
                    window.kakao.maps.load(() => {
                        console.log("Kakao maps initialized");
                        initializeMap();
                    });
                };

                script.onerror = (error) => {
                    script.onerror = (error) => {
                        console.error("Detailed error loading Kakao maps script:", error);
                        console.error("Error type:", error.type);
                        console.error("Error message:", error.message);
                        console.error("Error filename:", error.filename);
                        console.error("Error lineno:", error.lineno);
                        console.error("Error colno:", error.colno);
                        setError(`Failed to load map script: ${error.type}`);
                    };
                };

                document.head.appendChild(script);
            }
        };

        const initializeMap = () => {
            console.log("Initializing map");
            const mapContainer = document.getElementById("map");
            if (!mapContainer) {
                console.error("Map container not found");
                setError("Map container not found");
                return;
            }

            try {
                const mapOption = {
                    center: new window.kakao.maps.LatLng(mapL.y, mapL.x),
                    level: 2,
                };

                const map = new window.kakao.maps.Map(mapContainer, mapOption);
                mapRef.current = map;

                const markerPosition = new window.kakao.maps.LatLng(mapL.y, mapL.x);
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition
                });

                marker.setMap(map);
                console.log("Map initialized successfully");
            } catch (error) {
                console.error("Error initializing map:", error);
                setError("Failed to initialize map: " + error.message);
            }
        };

        loadKakaoMaps();

        return () => {
            if (mapRef.current) {
                console.log("Cleaning up map reference");
                mapRef.current = null;
            }
        };
    }, [mapL, isLoading]);

    if (isLoading) return <div>Loading map...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <MapModalBodyContainer>
            <div id="map" style={{ width: "100%", height: "400px" }}></div>
        </MapModalBodyContainer>
    );
}

export default MapModalBody;