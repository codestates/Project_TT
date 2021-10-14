import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import GlobalStyles from './components/GlobalStyles';
import Footer from './components/Footer';
import DestinationReviews from './components/DestinationReviews';
import Signup from './components/Signup';
import ThemeTravel from './components/ThemeTravel';
import Mypage from './components/Mypage';
import Review from './components/Review';
import ModifyProfile from './components/ModifyProfile';
import Signin from './components/Signin';
import NewReview from './components/NewReview';
import { API_URL } from './config/constants';
import axios from 'axios';

function App() {
  const [loginOn, setLoginOn] = useState(false); // 로그인 여부 (test : true로 바꾸고 개발)
  const [modalOn, setModalOn] = useState(false); // 모달 오픈 여부
  const [userInfo, setUserInfo] = useState({}); // 로그인 회원 정보
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    getUserInfo();
  }, []);

  async function getUserInfo() {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;

    axios(`${API_URL}/token-valid-check`, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Credentials': 'true',
      },
      withCredentials: true,
    })
      .then((res) => {
        // id, pw가 맞고 토큰이 유효하면 받아온 데이터를 userInfo에 저장

        console.log(res.data);
        setUserInfo(res.data);
        console.log(userInfo);

        // useHistory를 사용하여 로그인 성공시 모달창을 끄고 mypage로 이동
        setModalOn(false);
        setLoginOn(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <BrowserRouter>
      <div className="App">
        <GlobalStyles /> {/* CSS 전역 설정 */}
        <Signin
          modalOn={modalOn}
          setModalOn={setModalOn}
          setLoginOn={setLoginOn}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
        <Header modalOn={modalOn} setModalOn={setModalOn} setUserInfo={setUserInfo} loginOn={loginOn} setLoginOn={setLoginOn} />
        {/* 헤더(로고, 네비게이션) */}
        <Switch>
          <Route exact path="/">
            <ThemeTravel reviews={reviews} />
          </Route>
          <Route exact path="/destinationReviews">
            <DestinationReviews setLoginOn={setLoginOn} loginOn={loginOn} userInfo={userInfo} />
          </Route>
          <Route exact path="/themeTravel">
            <ThemeTravel reviews={reviews} />
          </Route>
          <Route exact path="/myPage">
            <Mypage setLoginOn={setLoginOn} userInfo={userInfo} setUserInfo={setUserInfo} />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/review">
            <Review loginOn={loginOn} userInfo={userInfo} />
          </Route>
          <Route exact path="/modifyProfile">
            <ModifyProfile setLoginOn={setLoginOn} userInfo={userInfo} setUserInfo={setUserInfo} />
          </Route>
          <Route exact path="/newReview">
            <NewReview userInfo={userInfo} />
          </Route>
        </Switch>
        <Footer /> {/* 푸터 */}
      </div>
      {/*회원 가입 모달 */}
    </BrowserRouter>
  );
}
export default App;
