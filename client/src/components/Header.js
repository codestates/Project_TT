import React from "react";
import { Link, useHistory, withRouter } from "react-router-dom";
import "../styles/Header.css";

function Header(props) {
  const history = useHistory();

  const loginModalOpen = () => {
    props.setModalOn(true);
    console.log(props.modalOn);
  };

  const handleSignOut = () => {
    // 로컬스토리지 accessToken 지우기
    localStorage.setItem("accessToken", "");
    history.push("/");
    props.setLoginOn(false);
    props.setUserInfo({});
  };

  return (
    <header id="header">
      <Link id="logo-link" to="/">
        <img src="/images/projecttt_logo.png" alt="Project_TT LOGO" />
      </Link>
      <nav id="nav">
        <ul id="ul">
          <li>
            <Link className="text-link" to="/themeTravel">
              테마별 여행
            </Link>
          </li>
          <li>
            <Link className="text-link" to="/destinationReviews">
              여행지 리뷰
            </Link>
          </li>
          {props.loginOn ? (
            <li>
              <Link className="text-link" to="/myPage">
                마이 페이지
              </Link>
            </li>
          ) : null}
          {props.loginOn ? (
            <li>
              <button className="text-link" onClick={handleSignOut}>
                로그아웃
              </button>
            </li>
          ) : (
            <li>
              <button className="text-link" onClick={loginModalOpen}>
                로그인
              </button>
            </li>
          )}
          {props.loginOn ? null : (
            <li>
              <Link className="text-link" to="/signUp">
                회원가입
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default withRouter(Header);
