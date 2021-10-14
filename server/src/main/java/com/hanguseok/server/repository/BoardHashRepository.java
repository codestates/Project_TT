package com.hanguseok.server.repository;

import com.hanguseok.server.entity.BoardHash;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardHashRepository extends JpaRepository<BoardHash, Long> {
}
