import React, { useEffect, useState } from 'react';
import '../styles/Mypage.css';
import UserReview from './UserReview';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/constants';

axios.defaults.withCredentials = true;

function Mypage(props) {
  const [reviews, setReviews] = useState([]);
  const [userInfos, setUserinfos] = useState({});

  const history = useHistory();

  useEffect(() => {
    getUserInfo();
    getReview();
  }, [props.userInfo]);

  // 유저 리뷰
  async function getReview() {
    await axios(`${API_URL}/profile/${userInfos.id}`, {
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
        let reviewObj = res.data.reviews;
        let objectToArray = [];
        let keys = Object.keys(reviewObj);
        for (let i = 0; i < keys.length; i++) {
          objectToArray.push({ ...reviewObj[keys[i]], id: keys[i] });
        }
        setReviews(objectToArray);
      })
      .catch((e) => {});
  }

  async function getUserInfo() {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;

    await axios(`${API_URL}/token-valid-check`, {
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
        setUserinfos(res.data);
        console.log(userInfos);
      })

      .catch((err) => {
        console.error(err);
      });
  }

  // 내가 쓴 리뷰 map
  const UserReviewList = reviews.map((ele) => (
    <Link
      className="userReview-link"
      to={{
        pathname: '/review',
        props: props,
        state: {
          id: ele.id,
          author: ele.author,
          content: ele.content,
          hashtags: ele.hashtags,
          image: ele.image,
          recommend: ele.recommend,
          region: ele.region,
          title: ele.title,
          view: ele.view,
        },
      }}
    >
      <UserReview
        className="userReviews"
        src={ele.image}
        title={ele.title}
        author={ele.author}
        region={ele.region}
        content={ele.content}
        view={ele.view}
        recommend={ele.recommend}
        hashtags={ele.hashtags}
      />
    </Link>
  ));

  // 회원 탈퇴 로직
  const withdrawal = async () => {
    await axios(`${API_URL}/user/${props.userInfo.id}`, {
      method: 'DELETE',
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE',
        'Access-Control-Allow-Credentials': 'true',
      },
      withCredentials: true,
    })
      .then((res) => {
        // 탈퇴 완료 후 메인 페이지로 이동
        props.setLoginOn(false);
        history.push('/');
      })
      .catch((err) => {
        console.error(err);
        // 에러 완료 후 메인 페이지로 이동
        props.setLoginOn(false);
        history.push('/');
      });
  };

  return (
    <div id="mypage">
      <div id="profile-contents">
        <div id="profile-photo">
          <span className="info-title">회원 정보</span>
          <img src="images/avatar.png" alt="프로필 사진" />
          <span id="member-name">{props.userInfo.nickname}</span>
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
            </ul>
          </div>
        </div>
        <div id="btn-contents">
          <Link id="logo-link" to="/ModifyProfile">
            <button className="info-btn">정보 수정</button>
          </Link>
          <button className="info-btn" onClick={withdrawal}>
            회원 탈퇴
          </button>
        </div>
        <span className="info-title">내가 쓴 리뷰</span>
        {UserReviewList}
      </div>
    </div>
  );
}

export default Mypage;
