import './featuredInfo.css'
import { HiOutlineCurrencyDollar, HiOutlineUserAdd ,HiOutlineTicket } from "react-icons/hi";
import { useEffect, useState } from 'react';
import AdminApi from '../../../../../api/AdminApi';

const FeaturedInfo=()=>{
    const [chartData, setChartData] = useState([]);
    
    useEffect(() => {
        const getChartData = async()=> {
            try {
                const res = await AdminApi.getChart();
                if(res.data.statusCode === 200){
                    setChartData(res.data.results);
                } 
                } catch (e) {
                    console.log(e);
                }
            }
            getChartData();
        }, []);

    
    return(
        <div className="featured">
            <div className="featuredItem">
                <HiOutlineCurrencyDollar className='featureIcon' size="70px"/>
                <div className='featured-content'>
                <div className="featureTitle">누적 수익</div>
                <div className="featuredRate">{chartData.finalAmount}</div>
                </div>
            </div>

            <div className="featuredItem">
                <HiOutlineUserAdd className='featureIcon' size="65px"/>
                <div className='featured-content'>
                <div className="featureTitle">누적 회원 수</div>
                <div className="featuredRate">{chartData.totalMember}</div>
                </div>
            </div>
            <div className="featuredItem">
                <HiOutlineTicket className='featureIcon' size="65px"/>
                <div className='featured-content'>
                <div className="featureTitle">누적 예매 수</div>
                <div className="featuredRate">{chartData.totalReserve}</div>
                </div>
            </div>
        </div>
    );

}
export default FeaturedInfo;