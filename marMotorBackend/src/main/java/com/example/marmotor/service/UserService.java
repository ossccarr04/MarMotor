package com.example.marmotor.service;

import com.example.marmotor.model.DTO.UserDTO;
import com.example.marmotor.model.entity.Car;
import com.example.marmotor.model.entity.User;
import com.example.marmotor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UserDTO getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return new UserDTO(
                user.getEmail(),
                user.getUsername(),
                user.getCreatedAt()
        );
    }

    public UserDTO updatePassword(String email, String currentPassword, String newPassword) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {

            throw new RuntimeException("La contraseña actual es incorrecta");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return new UserDTO(
                user.getEmail(),
                user.getUsername(),
                user.getCreatedAt()
        );
    }

    @Transactional
    public void desactivateMyAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.getFavoriteCars().clear();

        user.setDeletedAt(LocalDateTime.now());
        String uniqueSuffix = UUID.randomUUID().toString().substring(0, 8);
        user.setUsername("Eliminado_" + uniqueSuffix);
        String hashedEmail = passwordEncoder.encode(user.getEmail());
        user.setEmail("deleted_" + UUID.randomUUID().toString() + "_" + hashedEmail);

        user.setPassword("deletedPassword_" + UUID.randomUUID().toString());

        userRepository.save(user);
    }


}
