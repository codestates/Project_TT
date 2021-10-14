package com.hanguseok.server.service;

import com.hanguseok.server.entity.BoardHash;
import com.hanguseok.server.entity.Hashtag;
import com.hanguseok.server.repository.BoardHashRepository;
import com.hanguseok.server.repository.HashtagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class HashtagService {

    private final HashtagRepository hashtagRepository;
    private final BoardHashRepository boardHashRepository;

    public boolean alreadyExist(String name) {
        Optional<Hashtag> hashtag = hashtagRepository.findByName(name);
        if (hashtag.isPresent()) return true;
        else return false;
    }

    public Hashtag saveHashtag(String name) {
        Hashtag hashtag = Hashtag.builder()
                .name(name)
                .build();
        hashtagRepository.save(hashtag);
        return hashtag;
    }

    public Hashtag findHashtagByName(String name) {
        return hashtagRepository.findByName(name).get();
    }

    public List<Hashtag> findAllHashtag() {
        return hashtagRepository.findAll();
    }

    public void deleteNonExistReview() {
        List<BoardHash> boardHashes = boardHashRepository.findAll();
        List<Hashtag> hashtags = hashtagRepository.findAll();

        boolean isExist;
        for (Hashtag hashtag : hashtags) {
            isExist = false;
            for (BoardHash boardHash : boardHashes) {
                if (boardHash.getHashtag().getId().equals(hashtag.getId())) {
                    isExist = true;
                }
            }
            if (!isExist) {
                hashtagRepository.delete(hashtag);
            }
        }
    }

    public void deleteHashtag(Hashtag hashtag) {
        hashtagRepository.delete(hashtag);
    }
}
