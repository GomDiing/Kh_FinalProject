import './profile.css';
import '../adminButton.css';


const Profile=()=>{
    const data=[
        {
            id : "1",
            img : "https://itimg.chosun.com/sitedata/image/201809/07/2018090702435_0.jpg",
            name : "HJM",
            position : "Detail/MyPage/Sign/Login"
        },
        {
            id : "2",
            img : "https://itimg.chosun.com/sitedata/image/201809/07/2018090702435_0.jpg",
            name : "KST",
            position : "BackEnd"
        },
        {
            id : "3",
            img : "https://itimg.chosun.com/sitedata/image/201809/07/2018090702435_0.jpg",
            name : "PHR",
            position : "AdminPage"
        },
        {
            id : "4",
            img : "https://itimg.chosun.com/sitedata/image/201809/07/2018090702435_0.jpg",
            name : "JM",
            position : "Detail/MyPage/Sign/Login"
        },
        {
            id : "5",
            img : "https://itimg.chosun.com/sitedata/image/201809/07/2018090702435_0.jpg",
            name : "KSR",
            position : "Main / Menu / CSS"
        },

    ]
    return(
        <>
        <div className="profile-container">
        <button class="button-53" type="button">관리자</button>
            {data.map(p=>(
        <ul className='profile-list'>
            <li className='listItem'>
                <div className='profile-user'>
                    <img src={p.img} alt="" className='profile-img'/>
                </div>
                <div className='profile-text'>
                    <div className='profile-userName'>{p.name}</div>
                    <div className='profile-userTitle'>{p.position}</div>
                </div>
            </li>
        </ul>
        ))}
        </div>
        </>

    )

}
export default Profile;