import styled from "styled-components";
import RecentComment from "./recentComment/RecentComment";
import FeaturedInfo from "./featuredInfo/FeaturedInfo";
import Chart from "./chart/Chart";
import Profile from "./profile/Profile";


const AdminBlock=styled.div`
        width: 85%;
        margin: 0 auto;
    .home{
    margin-top: 15px;
    }
    .homeBottom{
    display: flex;
    margin: 20px;
    .RecnetCommentContainer{
        width: 70%;
    }
}
`;
const AdminHome=()=>{
    return(
        <AdminBlock>
        <div className="home">
            <FeaturedInfo/>
            <Chart/>
            <div className="homeBottom">
                <div className="RecnetCommentContainer">
                    <RecentComment/>
                </div>
                <Profile/>
            </div>
        </div>
        </AdminBlock>
    )
}
export default AdminHome;