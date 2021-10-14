package com.hanguseok.server.controller;

import com.hanguseok.server.dto.EditProfileDto;
import com.hanguseok.server.dto.LoginDto;
import com.hanguseok.server.dto.RegisterDto;
import com.hanguseok.server.entity.BoardHash;
import com.hanguseok.server.entity.ReviewBoard;
import com.hanguseok.server.entity.User;
import com.hanguseok.server.service.TokenService;
import com.hanguseok.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://projecttt-client-bucket.s3-website.ap-northeast-2.amazonaws.com", allowedHeaders = "*", allowCredentials = "true")
public class UserController {

    private final UserService userService;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto dto, HttpServletResponse response) {
        try {
            User user = userService.findUser(dto);
            if (userService.passwordCheck(user, dto.getPassword())) {
                String accessToken = tokenService.createJwtToken(user, 1L);
                String refreshToken = tokenService.createJwtToken(user, 2L);
                Cookie cookie = new Cookie("refreshToken", refreshToken);
                response.addCookie(cookie);

                return ResponseEntity.ok().body(new HashMap<>() {
                    {
                        put("id", user.getId());
                        put("accessToken", accessToken);
                        put("refreshToken", refreshToken);
                        put("message", "로그인에 성공했습니다.");
                    }
                });
            } else {
                return ResponseEntity.badRequest().body(new HashMap<>() {
                    {
                        put("message", "비밀번호가 틀렸습니다!");
                    }
                });
            }
        } catch (Exception e) {
            log.error("Login Exception Error : " + e);
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "Email이나 비밀번호 입력이 올바르지 않습니다.");
                }
            });
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody RegisterDto dto) {
        try {
            User user = userService.join(dto);
            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("id", user.getId());
                    put("email", user.getEmail());
                    put("nickname", user.getNickname());
                    put("message", null);
                }
            });
        } catch (Exception e) {
            log.error("Signup Exception : " + e);
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "회원가입에 실패했습니다.");
                }
            });
        }
    }

    @GetMapping("/email-duplication-check/{email}")
    public ResponseEntity<?> emailCheck(@PathVariable("email") String email) {
        if (userService.existEmail(email)) {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "이미 존재하는 이메일입니다!");
                }
            });
        } else {
            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("message", "사용 가능한 이메일입니다.");
                }
            });
        }
    }

    @GetMapping("/nickname-duplication-check/{nickname}")
    public ResponseEntity<?> nicknameCheck(@PathVariable("nickname") String nickname) {
        if (userService.existNickname(nickname)) {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "이미 존재하는 닉네임입니다.");
                }
            });
        } else {
            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("message", "사용 가능한 닉네임입니다.");
                }
            });
        }
    }

    @GetMapping("/token-valid-check")
    public ResponseEntity<?> tokenValidCheck(@RequestHeader Map<String, String> header) {
        tokenService.isValidAuthHeader(header.get("authorization"));
        String key = tokenService.extractToken(header.get("authorization"));

        Map<String, String> checkResult = tokenService.checkJwtToken(key);
        if (checkResult.get("email") != null) {
            User user = userService.findUserByEmail(checkResult.get("email"));

            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("message", checkResult.get("message"));
                    put("id", user.getId());
                    put("email", user.getEmail());
                    put("nickname", user.getNickname());
                }
            });
        } else {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", checkResult.get("message"));
                }
            });
        }
    }

    @GetMapping("/renewal-token")
    public ResponseEntity<?> renewalToken(HttpServletRequest request) {
        String cookiesResult = "";
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("refreshToken")) {
                cookiesResult = cookie.getValue();
            }
        }

        if (cookiesResult.equals("")) {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("data", null);
                    put("message", "refresh token 이 존재하지 않습니다.");
                }
            });
        }

        Map<String, String> checkResult = tokenService.checkJwtToken(cookiesResult);
        if (checkResult.get("email") != null) {
            User user = userService.findUserByEmail(checkResult.get("email"));
            String finalCookiesResult = cookiesResult;
            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("data", new HashMap<>() {
                        {
                            put("accessToken", tokenService.createJwtToken(user, 3000L));
                        }
                    });
                }
            });
        } else {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("data", null);
                    put("message", checkResult.get("message"));
                }
            });
        }
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getUserInfo(@PathVariable("id") Long id) {
        try {
            User user = userService.findUserById(id);

            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("message", "유저 정보가 성공적으로 조회되었습니다.");
                    put("id", user.getId());
                    put("email", user.getEmail());
                    put("nickname", user.getNickname());
                    put("reviews", new HashMap<>() {
                        {
                            List<ReviewBoard> reviews = user.getReviews();
                            for (ReviewBoard review : reviews) {
                                put(review.getId(), new HashMap<>() {
                                    {
                                        put("title", review.getTitle());
                                        put("content", review.getContent());
                                        put("image", review.getImage());
                                        put("author", review.getUser().getNickname());
                                        put("region", review.getRegion());
                                        put("view", review.getView());
                                        put("recommend", review.getRecommends().size());
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
                }
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "유저 정보 조회에 실패했습니다.");
                }
            });
        }
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> editProfile(@PathVariable("id") Long id, @RequestBody EditProfileDto dto) {
        try {
            User user = userService.editProfile(id, dto);
            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("message", "유저 정보가 수정되었습니다.");
                    put("id", user.getId());
                    put("email", user.getEmail());
                    put("nickname", user.getNickname());
                    put("reviews", new HashMap<>() {
                        {
                            List<ReviewBoard> reviews = user.getReviews();
                            for (ReviewBoard review : reviews) {
                                put(review.getId(), new HashMap<>() {
                                    {
                                        put("title", review.getTitle());
                                        put("content", review.getContent());
                                        put("image", review.getImage());
                                        put("author", review.getUser().getNickname());
                                        put("region", review.getRegion());
                                        put("view", review.getView());
                                        put("recommend", review.getRecommends().size());
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
                }
            });
        } catch (Exception e) {
            log.error("회원 수정 실패 에러 : " + e);
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "회원 정보 수정에 실패했습니다.");
                }
            });
        }
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("message", "유저 정보가 삭제되었습니다.");
                    put("id", id);
                }
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "유저 정보 삭제에 실패했습니다.");
                }
            });
        }
    }

}
