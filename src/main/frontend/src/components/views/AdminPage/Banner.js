import { useState, useEffect } from "react";
import NavBar from "./Tool/TopBar";
import styled from "styled-components";
import { storage } from "./Tool/Firebase";
import {ref, uploadBytes, listAll, getDownloadURL,deleteObject, getStorage, uploadString} from "firebase/storage";
import {v4, v4 as uuidv4} from "uuid";
// import { ref, uploadString, getDownloadURL, deleteObject } from "@firebase/storage";



const Banner=()=>{
    // 배너 제목, 링크 클릭시 이동 주소 담는 값
    const [title, setTitle] = useState("");
    const [adUrl, setAdUrl] = useState("");
    const[image, setImage] = useState("");
    // 사진 업로드 하고 담는 값

        const [attachment, setAttachment] = useState("");
        const [imageList, setImageList] =useState([]);
        let attachmentUrl = "";
        //사진 첨부 없이 텍스트만 트윗하고 싶을 때도 있으므로 기본 값을 ""로 해야한다.
        //트윗할 때 텍스트만 입력시 이미지 url ""로 비워두기 위함

        const onChangeImg = (e) => {
            const {
            target: { files },
            } = e;
            const theFile = files[0];
            console.log(theFile);
        
            const reader = new FileReader();
            reader.onloadend = (finishedEvent) => {
                const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
        };

        const onSubmit = async (e) => {
            e.preventDefault();
            //이미지 첨부하지 않고 텍스트만 올리고 싶을 때도 있기 때문에 attachment가 있을때만 아래 코드 실행
            //이미지 첨부하지 않은 경우엔 attachmentUrl=""이 된다.
            if (attachment !== "") {
                //파일 경로 참조 만들기
                const attachmentRef = ref(storage, `/image/${uuidv4()}`); //const fileRef = ref(storageService, `${ studyObj.studyId } / ${ uuidv4() }`);
                //storage 참조 경로로 파일 업로드 하기                                            위의 거로 바꿔주어야 스터디 아이디에 맞게 저장됨
                const response = await uploadString(attachmentRef, attachment, "data_url");
                //storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트
                attachmentUrl = await getDownloadURL(response.ref);
                console.log(attachmentUrl);
                getDownloadURL(response.ref).then((url)=>{
                    setImageList((prev)=>[...prev,url])
            })
        }
    };
    
        const imageListReg=ref(storage,"image/");
        useEffect(()=>{
            listAll(imageListReg).then((response)=>{
                console.log(response);
                response.items.forEach((item)=>{
                    getDownloadURL(item).then((url)=>{
                        setImageList((prev)=>[...prev,url])
                    })
                })
            })
        },[])

        const onDelete = async () => {
            console.log(attachmentUrl);
            const urlRef = ref(storage, attachmentUrl);
            try {
                if (attachmentUrl !== "") {
                    await deleteObject(urlRef);
                    console.log("삭제성공");
                    alert("삭제 성공")
                }
            } catch (error) {
                window.alert("이미지를 삭제하는 데 실패했습니다!");
                console.log("삭제실패");
            }
        }
    
    return(
        <BannerBlock>
        <NavBar name="광고/배너 관리"/>
        <div className="banner-Container">
        </div>
        <input type="file" onChange={onChangeImg}/>
        {attachment && (
            <div>
                <img src={attachment} width="30px" height="30px" alt=""/>
            </div>
            )}
            <button onClick={onSubmit}> 업로드하기</button>
            <button onClick={onDelete}>삭제하기</button>
            {imageList.map((url) => (<ul>
            <li><img src={url} alt=""/>
            </li></ul>
        ))} 
        {/* <button className="uploadAd">배너 등록하기</button>
        <h3>이미지 미리보기</h3> */}

        {/* <input className="form-control" type="file" id="formFile" onChange={imgChange} />
        <button type="button" className="btn btn-light" style={{ "float": "right" }} onClick={onSubmit}>업로드하기</button>

        <div className="preview">
            
        {imageList.map((url,idx) => (<ul>
            <li><img src={url} alt=""/>
            </li></ul>
        ))} 

        {/* </div> */}
        
        </BannerBlock>
    );
}
export default Banner;

const BannerBlock=styled.div`
    margin:0 auto;
    box-sizing: border-box;
  .banner-container {
    width: 100vw;
    margin : 10px;
    display: flex;
    border: 1px solid black;
    height: 60%;
    flex-direction: column;
    text-align: center;
    padding: 3rem;
  }
.preview{
    align-items: center;
    flex-direction: column;
    ul{
        list-style: none;
    }
    li{
    float: left;
}
}
    img{
        width: 300px;
        height: 200px;
        margin: 10px;
    }
`;