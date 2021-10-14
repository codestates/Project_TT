import React from 'react';
import '../styles/UserReview.css';

function UserReview(props) {
  // 해쉬태그 배열 형식에 맞게 변환
  const ConvertHashtag = props.hashtags.map((ele) => <>{`#${ele} `}</>);

  return (
    <>
      <div className="user-review-content">
        <img src={props.src} alt="여행이미지" />
        <div className="user-review-wrapper">
          <div className="user-review-main">
            <span className="user-review-title">{props.title}</span>
            <img src="/images/heart_recommand.png" alt="좋아요" />
            <span className="user-review-likes-count">{props.recommend}</span>
          </div>
          <span className="user-review-hashtags">{ConvertHashtag}</span>
          <span className="user-review-author">{`작성자 : ${props.author}`}</span>
          <span className="user-review-region">{`지역 : ${props.region}`}</span>
          <span className="user-review-description">
            {/* 문자 35자만 출력하고 끝에 점이 있으면 점 제거 후 양 옆 공백 제거 */}
            {props.content.slice(0, 35).replace(/.\s*$/, '').trim() + '...'}
          </span>
          <span className="user-review-count">{`조회수 : ${props.view}`}</span>
          <div className="user-review-likes"></div>
        </div>
      </div>
    </>
  );
}

export default UserReview;
