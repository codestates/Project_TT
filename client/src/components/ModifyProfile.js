import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/ModifyProfile.css';
import { API_URL } from '../config/constants';

function ModifyProfile(props) {
  const history = useHistory();

  const [changeNickname, setChangeNickname] = useState(props.userInfo.nickname);
  const [changePassword, setChangePassword] = useState('projecttt32');
  const [changePasswordValid, setChangePasswordValid] = useState('');
  const [modifyError, setModifyError] = useState('');

  const modifyInfo = async () => {
    if (changePassword === changePasswordValid) {
      await axios(`${API_URL}/profile/${props.userInfo.id}`, {
        method: 'PUT',
        data: { nickname: changeNickname, password: changePassword },
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'PUT',
          'Access-Control-Allow-Credentials': 'true',
        },
        withCredentials: true,
      })
        .then((res) => {
          console.log(res.data);
          props.setUserInfo(res.data);
          history.push('/mypage');
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setModifyError('비밀번호가 일치해야 합니다');
    }
  };

  const modifyNickname = (e) => {
    setChangeNickname(e.target.value);
    console.log(changeNickname);
  };

  const modifyPassword = (e) => {
    setChangePassword(e.target.value);
    console.log(changePassword);
  };

  const modifyPasswordValid = (e) => {
    setChangePasswordValid(e.target.value);
    console.log(changePasswordValid);
  };

  return (
    <div id="modify-profile">
      <div id="profile-contents">
        <div id="profile-photo">
          <span className="info-title">정보 수정</span>
          <img src="images/avatar.png" alt="프로필 사진" />
          <span className="modify-title">아이디</span>
          <input id="profile-modify-name" defaultValue={props.userInfo.nickname} onChange={modifyNickname}></input>
        </div>
        <div id="profile-password">
          <span className="modify-title">비밀번호</span>
          <input id="modify-password" type="password" defaultValue={changePassword} onChange={modifyPassword}></input>
          <span className="modify-title">비밀번호 재입력</span>
          <input id="modify-password-valid" type="password" onChange={modifyPasswordValid}></input>
          <span id="password-valid-check">
            {changePassword === changePasswordValid ? `비밀번호가 일치합니다.` : null}
          </span>
        </div>
        <div id="profile-info">
          <div id="profile-wrapper">
            <ul>
              <li className="profile-title">E-mail</li>
              <li className="profile-description">{props.userInfo.email}</li>
            </ul>
            <ul>
              <li className="profile-title">{''}</li>
              <li className="profile-description">{''}</li>
              <li id="modify-error">{modifyError}</li>
            </ul>
          </div>
        </div>
        <div id="btn-contents">
          <button className="info-btn" onClick={modifyInfo}>
            정보 수정
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModifyProfile;
