package com.hanguseok.server.repository;

import com.hanguseok.server.entity.ReviewBoard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewBoardRepository extends JpaRepository<ReviewBoard, Long> {

}
