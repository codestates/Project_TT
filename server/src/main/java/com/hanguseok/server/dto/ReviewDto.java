package com.hanguseok.server.dto;

import lombok.Data;

import java.util.List;

@Data
public class ReviewDto {

    private Long userId;
    private String title;
    private String content;
    private String region;
    private String image;
    private List<String> hashtags;

}
