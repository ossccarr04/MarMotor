package com.example.marmotor.service;

import com.example.marmotor.model.DTO.AuthDTO.AuthResponse;
import com.example.marmotor.model.DTO.AuthDTO.LoginRequest;
import com.example.marmotor.model.entity.User;
import com.example.marmotor.repository.UserRepository;
import io.jsonwebtoken.io.Decoders;
import org.springframework.beans.factory.annotation.Autowired;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Optional;

@Service
public class AuthService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Value("${jwt.secret}") // La clave secreta se leerá de application.properties
    private String secret;

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }


    public User register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("El nombre de usuario ya está en uso");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null) user.setRole(User.Role.USER);
        return userRepository.save(user);
    }

    public Optional<AuthResponse> login(LoginRequest request) {
        return userRepository.findByUsername(request.getUsername())
                .filter(user -> passwordEncoder.matches(request.getPassword(), user.getPassword()))
                .map(user -> {
                    String token = Jwts.builder()
                            .setSubject(user.getUsername())
                            .claim("role", user.getRole().name())
                            .setIssuedAt(new Date())
                            .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 día (86,400,000 ms)
                            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                            .compact();
                    return new AuthResponse(token, user.getEmail(), user.getRole().name());
                });
    }

    // Implementación de UserDetailsService
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
        
        // Spring Security User requiere username, password y authorities (roles)
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole().name()) // Asigna el rol como String
                .build();
    }
}