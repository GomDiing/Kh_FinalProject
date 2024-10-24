import React, { useEffect, useRef } from 'react';

const DaumPostcode = ({ onComplete, onClose }) => {
    const postcodeRef = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        script.onload = () => {
            new window.daum.Postcode({
                oncomplete: (data) => {
                    onComplete(data);
                    onClose();
                },
                width: '100%',
                height: '100%',
            }).embed(postcodeRef.current);
        };
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [onComplete, onClose]);

    return <div ref={postcodeRef} style={{ width: '100%', height: '400px' }} />;
};

export default DaumPostcode;