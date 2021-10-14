package com.hanguseok.server.service;

import com.hanguseok.server.entity.BoardHash;
import com.hanguseok.server.repository.BoardHashRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardHashService {

    private final BoardHashRepository boardHashRepository;

    public void connectTag(BoardHash boardHash) {
        boardHashRepository.save(boardHash);
    }

    public void deleteBoardHash(BoardHash boardHash) {
        boardHashRepository.delete(boardHash);
    }
}
