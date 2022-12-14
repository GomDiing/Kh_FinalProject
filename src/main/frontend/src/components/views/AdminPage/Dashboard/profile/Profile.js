import TopBar from '../../Tool/TopBar';
import './profile.css';

const Profile=()=>{
    const data=[
        {
            id : "1",
            img : "https://itimg.chosun.com/sitedata/image/201809/07/2018090702435_0.jpg",
            name : "하정목",
            position : "대표이사"
        },
        {
            id : "2",
            img : "https://itimg.chosun.com/sitedata/image/201809/07/2018090702435_0.jpg",
            name : "김성탁",
            position : "대표이사"
        },
        {
            id : "3",
            img : "https://itimg.chosun.com/sitedata/image/201809/07/2018090702435_0.jpg",
            name : "박하린",
            position : "대표이사"
        },
        {
            id : "4",
            img : "https://itimg.chosun.com/sitedata/image/201809/07/2018090702435_0.jpg",
            name : "지민",
            position : "대표이사"
        },
        {
            id : "5",
            img : "https://itimg.chosun.com/sitedata/image/201809/07/2018090702435_0.jpg",
            name : "김승렬",
            position : "대표이사"
        },

    ]
    return(
        <>
        <div className="profile-container">
            {data.map(c=>(
        <ul className='profile-list'>
            <li className='listItem'>
                <div className='profile-user'>
                    <img src={c.img} alt="" className='profile-img'/>
                    <div className='profile-userName'>{c.name}</div>
                    <div className='profile-userTitle'>{c.position}</div>
                </div>
            </li>

        </ul>
        ))}
        </div>
        </>

    )

}
export default Profile;