package com.hanguseok.server.service;

import com.hanguseok.server.entity.User;
import io.jsonwebtoken.*;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.Duration;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class TokenService {

    private final static String KEY = "hanguseokkey";

    public String createJwtToken(User user, Long time) {
        Date now = new Date();

        return Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)
                .setIssuer("fresh")
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + Duration.ofHours(time).toMillis()))
                .claim("email", user.getEmail())
                .claim("password", user.getPassword())
                .signWith(SignatureAlgorithm.HS256, KEY)
                .compact();
    }

    public Map<String, String> checkJwtToken(String key) {
        try {
            Claims claims = Jwts.parser().setSigningKey(KEY)
                    .parseClaimsJws(key)
                    .getBody();

            String email = (String) claims.get("email");
            return new HashMap<>() {
                {
                    put("email", email);
                    put("message", "토큰이 유효합니다.");
                }
            };
        } catch (ExpiredJwtException e) {
            return new HashMap<>() {
                {
                    put("email", null);
                    put("message", "토큰 시간이 만료되었습니다.");
                }
            };
        } catch (JwtException e) {
            return new HashMap<>() {
                {
                    put("email", null);
                    put("message", "토큰이 유효하지 않습니다.");
                }
            };
        }
    }

    public void isValidAuthHeader(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer")) {
            throw new IllegalArgumentException();
        }
    }

    public String extractToken(String authorization) {
        return authorization.substring("Bearer ".length());
    }

}
