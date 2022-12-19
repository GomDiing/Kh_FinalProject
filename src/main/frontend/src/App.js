import Login from "./components/views/LoginPage/Login";
import {Routes, Route} from "react-router-dom";
import Sign from "./components/views/SignPage/Sign";
import MainPage from "./components/views/MainPage/MainPage";
import AdminPage from "./components/views/AdminPage/AdminPage";
import Detail from "./components/views/DetailPage/Detail";
import MyPage from "./components/views/MyPage/MyPage";
import ResultFalse from "./components/KakaoPay/ResultFalse";
import { PayCancel, PayReady, PayResult } from "./components/KakaoPay/PayReady";
import Agree from "./components/views/SignPage/Agree";
import SearchResult from "./components/views/MainHeader/Search/Search";


function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<MainPage/>}/>
      <Route path="/search" element={<SearchResult/>}/>
      <Route path='/admin/*' element={<AdminPage/>}/>
      <Route path='/MyPage/*' element={<MyPage/>}/>
      <Route path='/login' element={<Login />} />
      <Route path='/sign' element={<Sign />} />
      <Route exact path="/detail/:code" element={<Detail />} />
      {/* 지민 추가했습니다.. */}
      <Route path="/payready" element={<PayReady />} />
      <Route path="/payresult" element={<PayResult />} />
      <Route path="/paycancel" element={<PayCancel />} />
      <Route path="/resultfalse" element={<ResultFalse />} />
      <Route path="/agree" element={<Agree />} />
    </Routes>
    </>
  );
}
export default App;
