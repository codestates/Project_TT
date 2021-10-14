import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/constants';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/ThemeSlide.css';

function ThemeSlide() {
  const settings01 = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const csstyle = `
  .slick-next:before, .slick-prev:before {
    color: #000;
    font-family: "slick";
    font-size: 40px;
  }

  .slick-prev:before {
    margin-left: -15px;
  }
  `;

  const [reviews, setReviews] = useState([]);
  const [topHashtags, setTopHashtags] = useState([]);

  let mostHashtags = undefined;

  let filteredHashtagReviews01 = reviews.filter(
    (ele) =>
      ele.hashtags[0] === topHashtags[0] ||
      ele.hashtags[1] === topHashtags[0] ||
      ele.hashtags[2] === topHashtags[0] ||
      ele.hashtags[3] === topHashtags[0] ||
      ele.hashtags[4] === topHashtags[0]
  );

  let filteredHashtagReviews02 = reviews.filter(
    (ele) =>
      ele.hashtags[0] === topHashtags[1] ||
      ele.hashtags[1] === topHashtags[1] ||
      ele.hashtags[2] === topHashtags[1] ||
      ele.hashtags[3] === topHashtags[1] ||
      ele.hashtags[4] === topHashtags[1]
  );

  let filteredHashtagReviews03 = reviews.filter(
    (ele) =>
      ele.hashtags[0] === topHashtags[2] ||
      ele.hashtags[1] === topHashtags[2] ||
      ele.hashtags[2] === topHashtags[2] ||
      ele.hashtags[3] === topHashtags[2] ||
      ele.hashtags[4] === topHashtags[2]
  );

  let filteredHashtagReviews04 = reviews.filter(
    (ele) =>
      ele.hashtags[0] === topHashtags[3] ||
      ele.hashtags[1] === topHashtags[3] ||
      ele.hashtags[2] === topHashtags[3] ||
      ele.hashtags[3] === topHashtags[3] ||
      ele.hashtags[4] === topHashtags[3]
  );

  let filteredHashtagReviews05 = reviews.filter(
    (ele) =>
      ele.hashtags[0] === topHashtags[4] ||
      ele.hashtags[1] === topHashtags[4] ||
      ele.hashtags[2] === topHashtags[4] ||
      ele.hashtags[3] === topHashtags[4] ||
      ele.hashtags[4] === topHashtags[4]
  );

  // TOP 3 해시 태그
  console.log(topHashtags);
  console.log(reviews);
  console.log(filteredHashtagReviews01);
  console.log(filteredHashtagReviews02);
  console.log(filteredHashtagReviews03);
  console.log(filteredHashtagReviews04);
  console.log(filteredHashtagReviews05);

  useEffect(() => {
    async function getReview() {
      await axios(`${API_URL}/review/`, {
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

          const result = {};
          let keys = Object.keys(reviewObj);
          for (let i = 0; i < keys.length; i++) {
            objectToArray.push({ ...reviewObj[keys[i]], id: keys[i] });
          }
          setReviews(objectToArray);

          let hashtags = [];
          let hashtagArr = [];
          let topHashtagArr = [];

          for (let i = 0; i < objectToArray.length; i++) {
            hashtags.push(objectToArray[i].hashtags);
          }
          hashtagArr = hashtags.flat();

          hashtagArr.forEach((ele) => {
            result[ele] = (result[ele] || 0) + 1;
          });

          let sortObj = [];

          for (let number in result) {
            sortObj.push([number, result[number]]);
          }

          sortObj.sort(function (a, b) {
            return b[1] - a[1];
          });

          console.log(sortObj);

          mostHashtags = sortObj.slice(0, 5);

          for (let i = 0; i < mostHashtags.length; i++) {
            topHashtagArr.push(mostHashtags[i][0]);
          }

          setTopHashtags(topHashtagArr);
        })

        .catch((e) => {});
    }
    getReview();
  }, []);

  const UserReviewList01 = filteredHashtagReviews01.map((ele) => <SlideImage ele={ele} />);

  const UserReviewList02 = filteredHashtagReviews02.map((ele) => <SlideImage ele={ele} />);

  const UserReviewList03 = filteredHashtagReviews03.map((ele) => <SlideImage ele={ele} />);

  const UserReviewList04 = filteredHashtagReviews04.map((ele) => <SlideImage ele={ele} />);

  const UserReviewList05 = filteredHashtagReviews05.map((ele) => <SlideImage ele={ele} />);

  return (
    <>
      <div id="theme-travel-content">
        <style>{csstyle}</style>
        <div className="theme-title">
          <span>{`#${topHashtags[0]}`}</span>
        </div>
        <Slider {...settings01}>{UserReviewList01}</Slider>
        <div className="theme-title">
          <span>{`#${topHashtags[1]}`}</span>
        </div>
        <Slider {...settings01}>{UserReviewList02}</Slider>
        <div className="theme-title">
          <span>{`#${topHashtags[2]}`}</span>
        </div>
        <Slider {...settings01}>{UserReviewList03}</Slider>
        <div className="theme-title">
          <span>{`#${topHashtags[3]}`}</span>
        </div>
        <Slider {...settings01}>{UserReviewList04}</Slider>
        <div className="theme-title">
          <span>{`#${topHashtags[4]}`}</span>
        </div>
        <Slider {...settings01}>{UserReviewList05}</Slider>
      </div>
    </>
  );
}

function SlideImage(props) {
  return (
    <Link
      className="themeTravel-link"
      to={{
        pathname: '/review',
        props: props,
        state: {
          id: props.ele.id,
          author: props.ele.author,
          content: props.ele.content,
          hashtags: props.ele.hashtags,
          image: props.ele.image,
          recommend: props.ele.recommend,
          region: props.ele.region,
          title: props.ele.title,
          view: props.ele.view,
        },
      }}
    >
      <img src={props.ele.image} alt={props.ele.id} className="theme-slide-img" />
      <span className="theme-titles-span">{props.ele.title.slice(0, 20).trim()}</span>
    </Link>
  );
}

export default ThemeSlide;
