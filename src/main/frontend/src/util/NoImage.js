import iconSad from "../images/sad.jpg"

// DB에 이미지가 없을시 보여주기 위한 박스
function NoImage() {
  return (
    <div>
      <img src={iconSad} alt="NoImg" style={{width: '200px', height: '250px'}} />
    </div>
  );
}

export default NoImage;