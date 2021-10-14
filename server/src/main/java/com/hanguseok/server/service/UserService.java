package com.hanguseok.server.service;

import com.hanguseok.server.dto.EditProfileDto;
import com.hanguseok.server.dto.LoginDto;
import com.hanguseok.server.dto.RegisterDto;
import com.hanguseok.server.entity.User;
import com.hanguseok.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User findUser(LoginDto dto) {
        return userRepository.findByEmail(dto.getEmail()).get();
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).get();
    }

    public User join(RegisterDto dto) {
        User user = User.builder()
                .email(dto.getEmail())
                .nickname(dto.getNickname())
                .password(dto.getPassword())
                .build();
        userRepository.save(user);
        return user;
    }

    public boolean existEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return true;
        } else {
            return false;
        }
    }

    public boolean existNickname(String nickname) {
        Optional<User> user = userRepository.findByNickname(nickname);
        if (user.isPresent()) {
            return true;
        } else {
            return false;
        }
    }

    public User findUserById(Long userId) {
        return userRepository.findById(userId).get();
    }

    public boolean passwordCheck(User user, String password) {
        if (user.getPassword().equals(password)) return true;
        else return false;
    }

    public User editProfile(Long id, EditProfileDto dto) {
        User userRepo = userRepository.findById(id).get();
        User user = User.builder()
                .id(id)
                .nickname(dto.getNickname())
                .password(dto.getPassword())
                .email(userRepo.getEmail())
                .comments(userRepo.getComments())
                .reviews(userRepo.getReviews())
                .build();
        userRepository.save(user);
        return user;
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
