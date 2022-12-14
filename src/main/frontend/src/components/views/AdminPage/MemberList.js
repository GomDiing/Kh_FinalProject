import styled from "styled-components";
import TopBar from "./Tool/TopBar";
import { useState, useEffect } from "react";
import AdminApi from "../../../api/AdminApi";
import Pagination from "./Tool/Pagination/Paging";


const MemberList=()=>{

  // 페이지네이션 변수
  const [limit, setLimit] = useState(10); // 한페이지에 보여지는 게시물 갯수
  const [page, setPage] = useState(1); // 현재 페이지 번호
  const offset = (page - 1) * limit; // 각 페이지별 첫 게시물의 위치 계산
  const [pageStart, setPageStart] = useState(0);

  // 체크박스 변수
  const [memberList, setMemberList] = useState('');
  const [checkItems, setCheckItems] = useState([]); 

  // 체크박스 단일 선택
  const handleSingleCheck = (checked, obj) => {
    if (checked) {
      setCheckItems(prev => [...prev, obj]);
      console.log(obj);
    } else {
      // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
      setCheckItems(checkItems.filter((el) => el !== obj));
    }
  };

  // 체크박스 전체 선택
  const handleAllCheck = (checked) => {
    if(checked) {
      // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
      const idArray = [];
      memberList.forEach((el) => idArray.push(el));
      setCheckItems(idArray);
    }
    else {
      setCheckItems([]);
    }
  }
  useEffect(() => {
    const memberData = async()=> {
      try {
        const response = await AdminApi.totalMember(); // 전체 멤버 조회
        setMemberList(response.data);
        console.log(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    memberData();
  }, []);

    return(
        <MemberBlock>
          <TopBar name="일반회원관리"/>
          <div className="memberList-container">
          <table>
                <thead>
                  <tr>
                  <th width = "30px">
                    <input type='checkbox' name='select-all' onChange={(e) => handleAllCheck(e.target.checked)}
                    // 데이터 개수와 체크된 아이템의 개수가 다를 경우 선택 해제 (하나라도 해제 시 선택 해제)
                    checked={checkItems.length === memberList.length ? true : false} />
                    </th>
                    <th width = "100px">아이디</th>
                    <th width = "100px">이름</th>
                    <th width = "150px">이메일</th>
                    <th width = "150px">가입일</th>
                    <th width = "150px">주소</th>
                  </tr>
                </thead>
                <tbody>
                  {memberList && memberList.slice(offset, offset + limit).map(({index,id, name, date, email, address,createTime}) => (<tr>
                  <td><input type='checkbox' name={`select-${index}`} onChange={(e) => handleSingleCheck(e.target.checked, index)}
                   // 체크된 아이템 배열에 해당 아이템이 있을 경우 선택 활성화, 아닐 시 해제
                  checked={checkItems.includes(index) ? true : false} />
                  </td>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>{createTime}</td>
                    <td>{address}</td>
                </tr>
                ))}
                </tbody>
              </table>
            </div>
            <Pagination
            total={memberList.length}
            limit={limit}
            page={page}
            setPage={setPage}
            pageStart={pageStart}
            setPageStart={setPageStart}
            />
        </MemberBlock>
    );
}
export default MemberList;

const MemberBlock=styled.div`
  margin:0 auto;
  box-sizing: border-box;
  /* width: 100vw; */
  .memberList-container {
    width: 70vw;
    margin : 10px;
    display: flex;
    border: 1px solid black;
    height: 60%;
    flex-direction: column;
    text-align: center;
    padding: 3rem;
  }
table,th,td {
  border: 1px solid black;
}
`;