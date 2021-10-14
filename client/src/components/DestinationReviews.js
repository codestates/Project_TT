import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Destination.css';
import axios from 'axios';

axios.defaults.withCredentials = true;

//TODO: 게시글 없을때 대체 이미지 만들기
function DestinationReviews(props) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getReview();
  }, []);

  async function getReview() {
    await axios('http://ec2-3-35-140-107.ap-northeast-2.compute.amazonaws.com:8080/review/', {
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
        let reviewObj = res.data;
        let objectToArray = [];
        let keys = Object.keys(reviewObj);
        for (let i = 0; i < keys.length; i++) {
          objectToArray.push({ ...reviewObj[keys[i]], id: keys[i] });
        }
        objectToArray.sort(function (a, b) {
          return b.recommend - a.recommend;
        });
        setReviews(objectToArray);
      })
      .catch((e) => {});
  }
  return (
    <div id="dest-review-content">
      <div id="landing-top-content">
        <video width="300" height="200" muted autoplay="autoplay" loop>
          <source src="https://pixabay.com/ko/videos/download/video-52849_medium.mp4" type="video/mp4" muted />
        </video>
        <span id="dest-top-text">{`여행지 리뷰`}</span>
      </div>
      {props.loginOn ? (
        <Link
          className="post-links"
          to={{
            pathname: '/newReview',
            mode: 'newPost',
            props: props,
          }}
        >
          <button id="posts-btn">글쓰기</button>
        </Link>
      ) : null}
      <div className="reviews-block">
        {reviews.map((ele) => (
          <div className="board-block">
            <Link
              className="review-link"
              to={{
                pathname: '/review',
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
              <div id="dest-review-wrapper">
                <img className="image-box" src={ele.image} alt={ele.image} />
                <div id="dest-wrapper">
                  <div id="recommend-wrapper">
                    <div id="recommend-text">
                      <img id="recommend-icon" src="/images/heart_recommand.png" />
                      {ele.recommend}
                    </div>
                  </div>
                  <div id="dest-review-region">{ele.region}</div>
                  <div id="dest-review-title">{ele.title}</div>
                  <div id="dest-review-description">{ele.content.slice(0, 30).replace(/.\s*$/, '').trim() + '...'}</div>
                  <div className="hashtags">{ele.hashtags.map((el) => '#' + el + ' ')}</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
export default DestinationReviews;
