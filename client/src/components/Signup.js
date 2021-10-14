import "../styles/Signup.css";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

function Signup() {
  const [userinfo, setuserinfo] = useState({
    email: "",
    password: "",
    nickname: "",
  });
  const [emailValidation, setEmailValidation] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("")
  const [nicknameValidation, setNicknameValidation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleInputValue = (key) => (e) => {
    setuserinfo({ ...userinfo, [key]: e.target.value });
  };
  const emailRule =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const history = useHistory();
  // 회원가입
  async function transfortForm() {
    //모든필드의 값이 null이 아니어야 함.
    if (
      userinfo.email === "" ||
      userinfo.password === "" ||
      userinfo.nickname === ""
    ) {
      setErrorMessage("모든 내용을 작성해 주세요");
      return null;
    }
    if( !(passwordValidation && nicknameValidation && emailValidation)){
      setErrorMessage("다시 확인해주세요");
      return null;
    }
    setErrorMessage("");

    //회원가입 POST
    await axios(
      "http://ec2-3-35-140-107.ap-northeast-2.compute.amazonaws.com:8080/signup",
      {
        method: "POST",
        data: {
          email: userinfo.email,
          password: userinfo.password,
          nickname: userinfo.nickname,
        },
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Credentials": "true",
        },
        withCredentials: true,
      }
    )
      .then((res) => {
        history.push("/");
      })
      .catch((e) => {
        setErrorMessage("회원가입에 실패하였습니다");
      });
  }

  const checkingPassword = (e) => {
    console.log(e.target.value);
    if (userinfo.password !== e.target.value) {
      setErrorMessage("비밀번호가 일치하지 않습니다");
      setPasswordValidation(false)
    } else {
      setErrorMessage("");
      setPasswordValidation(true)
    }
  };
  //중복 이메일 찾기
  async function emailValidationCheck(e) {
    //정규식 처리 나중에
    // if (!emailRule.test(String(userinfo.email))) {
    //   setEmailValidation(false);
    // }
    await axios(
      "http://ec2-3-35-140-107.ap-northeast-2.compute.amazonaws.com:8080/email-duplication-check/" +
        userinfo.email,
      {
        method: "GET",
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Credentials": "true",
        },
        withCredentials: true,
      }
    )
      .then((res) => {
        setEmailValidation(true);
      })
      .catch((e) => {
        setEmailValidation(false);
      });
  }
  //중복 닉네임 찾기
  async function nicknameValidationCheck() {
    await axios(
      "http://ec2-3-35-140-107.ap-northeast-2.compute.amazonaws.com:8080/nickname-duplication-check/" +
        userinfo.nickname,
      {
        method: "GET",
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Credentials": "true",
        },
        withCredentials: true,
      }
    )
      .then((res) => {
        setNicknameValidation(true);
      })
      .catch((e) => {
        setNicknameValidation(false);
      });
  }
  return (
    <div id="container">
      <div id="content">
        <div id="signup-title">회원가입</div>
        <div class="row_group">
          <h3>
            <label for="email">이메일</label>
          </h3>
          <span class="input_box">
            <input
              type="text"
              id="email"
              class="int"
              onBlur={emailValidationCheck}
              onChange={handleInputValue("email")}
            ></input>
          </span>
          {emailValidation === "" || emailValidation === true ? (
            <div></div>
          ) : (
            <div className="alert-message">
              중복이거나 사용 불가능한 이메일입니다
            </div>
          )}
          <h3>
            <label for="password">비밀번호</label>
          </h3>
          <span class="input_box">
            <input
              id="password"
              class="int"
              type="password"
              onChange={handleInputValue("password")}
            ></input>
          </span>
          <h3>
            <label for="password_check">비밀번호 재확인</label>
          </h3>

          <span class="input_box">
            <input
              type="password"
              id="password_check"
              class="int"
              onChange={checkingPassword}
            ></input>
          </span>
        </div>
        <div class="row_group">
          <h3>
            <label for="nickname">닉네임</label>
          </h3>
          <span class="input_box">
            <input
              type="text"
              id="nickname"
              class="int"
              onBlur={nicknameValidationCheck}
              onChange={handleInputValue("nickname")}
            ></input>
          </span>
          {nicknameValidation === "" || nicknameValidation === true ? (
            <div></div>
          ) : (
            <div className="alert-message">이미 사용중인 닉네임입니다</div>
          )}
        </div>
        {errorMessage === "" ? null : (
          <div className="alert-box">{errorMessage}</div>
        )}
        <div>
          <button className="signup-btn" onClick={transfortForm}>
            회원 가입
          </button>
        </div>
      </div>
    </div>
  );
}
export default Signup;
