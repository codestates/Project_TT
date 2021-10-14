package com.hanguseok.server.repository;

import com.hanguseok.server.entity.Recommend;
import com.hanguseok.server.entity.ReviewBoard;
import com.hanguseok.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecommendRepository extends JpaRepository<Recommend, Long> {

    List<Recommend> findByUser(User user);

    List<Recommend> findByReview(ReviewBoard review);

    Optional<Recommend> findByUserAndReview(User user, ReviewBoard review);

}
