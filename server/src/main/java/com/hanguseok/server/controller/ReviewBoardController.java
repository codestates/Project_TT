package com.hanguseok.server.controller;

import com.hanguseok.server.dto.RecommendDto;
import com.hanguseok.server.dto.ReviewDto;
import com.hanguseok.server.entity.*;
import com.hanguseok.server.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/review")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://projecttt-client-bucket.s3-website.ap-northeast-2.amazonaws.com", allowedHeaders = "*", allowCredentials = "true")
public class ReviewBoardController {

    private final ReviewBoardService reviewBoardService;
    private final HashtagService hashtagService;
    private final UserService userService;
    private final BoardHashService boardHashService;
    private final RecommendService recommendService;

    @GetMapping
    public ResponseEntity<?> allReview() {
        try {
            List<ReviewBoard> reviews = reviewBoardService.findAllReviews();
            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    for (ReviewBoard review : reviews) {
                        put(review.getId(), new HashMap<>() {
                            {
                                put("title", review.getTitle());
                                put("view", review.getView());
                                put("recommend", review.getRecommends().size());
                                put("image", review.getImage());
                                put("content", review.getContent());
                                put("region", review.getRegion());
                                put("author", review.getUser().getNickname());
                                List<String> hashtags = new ArrayList<>();
                                for (BoardHash boardHash : review.getHashtags()) {
                                    hashtags.add(boardHash.getHashtag().getName());
                                }
                                put("hashtags", hashtags);
                            }
                        });
                    }
                }
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "리뷰 게시글 데이터를 받아올 수 없습니다!");
                }
            });
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findReviewById(@PathVariable("id") Long id) {
        try {
            ReviewBoard review = reviewBoardService.findReviewById(id);
            review.setView(review.getView() + 1);
            reviewBoardService.saveReview(review);
            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("id", review.getId());
                    put("title", review.getTitle());
                    put("image", review.getImage());
                    put("content", review.getContent());
                    put("comments", new HashMap<>() {
                        {
                            List<Comment> comments = review.getComments();
                            for (Comment comment : comments) {
                                put(comment.getId(), new HashMap<>() {
                                    {
                                        put("comment-writer", comment.getUser().getNickname());
                                        put("comment-content", comment.getContent());
                                    }
                                });
                            }
                        }
                    });
                    List<String> hashtags = new ArrayList<>();
                    for (BoardHash boardHash : review.getHashtags()) {
                        hashtags.add(boardHash.getHashtag().getName());
                    }
                    put("hashtags", hashtags);
                    put("author", review.getUser().getNickname());
                    put("view", review.getView());
                    put("recommend", review.getRecommends().size());
                    put("region", review.getRegion());
                    put("message", "리뷰 게시글 조회에 성공했습니다.");
                }
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "잘못된 조회 요청입니다!");
                }
            });
        }
    }

    @PostMapping
    public ResponseEntity<?> uploadReview(@RequestBody ReviewDto dto) {
        try {
            List<Hashtag> hashtags = new ArrayList<>();
            for (String el : dto.getHashtags()) {
                Hashtag hashtag;
                if (!hashtagService.alreadyExist(el)) {
                    hashtag = hashtagService.saveHashtag(el);
                } else {
                    hashtag = hashtagService.findHashtagByName(el);
                }
                hashtags.add(hashtag);
            }

            User user = userService.findUserById(dto.getUserId());

            ReviewBoard review = reviewBoardService.initReview(user, dto);

            for (Hashtag hashtag : hashtags) {
                BoardHash boardHash = BoardHash.builder()
                        .hashtag(hashtag)
                        .review(review)
                        .build();

                boardHashService.connectTag(boardHash);
            }

            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("id", review.getId());
                    put("title", review.getTitle());
                    put("image", review.getImage());
                    put("content", review.getContent());
                    put("region", review.getRegion());
                    put("author", review.getUser().getNickname());
                }
            });
        } catch (Exception e) {
            log.error("리뷰 등록 에러 : " + e);
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "잘못된 등록 요청입니다!");
                }
            });
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable("id") Long id) {
        try {
            reviewBoardService.deletePost(id);
            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("message", "리뷰가 성공적으로 삭제되었습니다.");
                }
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "리뷰가 삭제되지 않았습니다.");
                }
            });
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editReview(@PathVariable("id") Long id, @RequestBody ReviewDto dto) {
        try {
            ReviewBoard review = reviewBoardService.editReview(id, dto);
            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("id", review.getId());
                    put("title", review.getTitle());
                    put("content", review.getContent());
                    put("image", review.getImage());
                    put("message", "성공적으로 수정되었습니다.");
                }
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "수정 작업에 실패했습니다.");
                }
            });
        }
    }

    @PostMapping("/recommend")
    public ResponseEntity<?> reviewRecommend(@RequestBody RecommendDto dto) {
        try {
            User user = userService.findUserById(dto.getUserId());
            ReviewBoard review = reviewBoardService.findReviewById(dto.getReviewId());
            int len;
            if (recommendService.alreadyRecommend(user, review)) {
                recommendService.deleteRecommend(user, review);
                len = recommendService.findByReview(review).size();

                return ResponseEntity.ok().body(new HashMap<>() {
                    {
                        put("message", "이미 추천했습니다.");
                        put("추천 수", len);
                    }
                });
            } else {
                recommendService.createRecommend(user, review);
                len = recommendService.findByReview(review).size();

                return ResponseEntity.ok().body(new HashMap<>() {
                    {
                        put("message", "게시글을 추천했습니다.");
                        put("추천 수", len);
                    }
                });
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "게시글 추천에 실패했습니다!");
                }
            });
        }
    }

}
