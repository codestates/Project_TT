package com.hanguseok.server.controller;

import com.hanguseok.server.entity.BoardHash;
import com.hanguseok.server.entity.Hashtag;
import com.hanguseok.server.entity.ReviewBoard;
import com.hanguseok.server.service.HashtagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://projecttt-client-bucket.s3-website.ap-northeast-2.amazonaws.com", allowedHeaders = "*", allowCredentials = "true")
public class HomeController {

    private final HashtagService hashtagService;

    @GetMapping("/")
    public ResponseEntity<?> Homepage() {
        try {
            List<Hashtag> hashtags = hashtagService.findAllHashtag();
            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("message", "테마별 여행지 목록이 성공적으로 조회되었습니다.");
                    for (Hashtag hashtag : hashtags) {
                        put(hashtag.getName(), new HashMap<>() {
                            {
                                for (BoardHash boardHash : hashtag.getReviews()) {
                                    ReviewBoard review = boardHash.getReview();
                                    put(review.getId(), new HashMap<>() {
                                        {
                                            put("title", review.getTitle());
                                            put("content", review.getContent());
                                            put("view", review.getView());
                                            put("recommended", review.getRecommends().size());
                                            put("image", review.getImage());
                                            put("region", review.getRegion());
                                            put("author", review.getUser().getNickname());
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "테마별 여행지 조회에 실패했습니다.");
                }
            });
        }
    }

}
