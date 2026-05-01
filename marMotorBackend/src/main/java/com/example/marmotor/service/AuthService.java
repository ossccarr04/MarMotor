package com.example.marmotor.service;

import com.example.marmotor.config.PasswordEncoderConfig;
import com.example.marmotor.model.DTO.AuthDTO.AuthResponse;
import com.example.marmotor.model.DTO.AuthDTO.LoginRequest;
import com.example.marmotor.model.DTO.UserDTO;
import com.example.marmotor.model.entity.PasswordResetToken;
import com.example.marmotor.model.entity.User;
import com.example.marmotor.repository.PasswordResetTokenRepository;
import com.example.marmotor.repository.UserRepository;
import io.jsonwebtoken.io.Decoders;
import jakarta.validation.constraints.Email;
import org.springframework.beans.factory.annotation.Autowired;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Key;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoderConfig passwordEncoderConfig;
    
    @Value("${jwt.secret}") // La clave secreta se leerá de application.properties
    private String secret;

    @Value("${app.frontend.reset-password-url}")
    private String resetPasswordBaseUrl;

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }


    public User register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("El nombre de usuario ya está en uso");
        }
        user.setPassword(passwordEncoderConfig.passwordEncoder().encode(user.getPassword()));
        if (user.getRole() == null) user.setRole(User.Role.USER);
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado"));

        // 2. Validamos la contraseña
        if (!passwordEncoderConfig.passwordEncoder().matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Contraseña incorrecta");
        }

        String token = Jwts.builder()
                .setSubject(user.getEmail())
                .claim("user", user.getUsername())
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();

        return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }



    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));;


        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }

    @Transactional
    public void processForgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        LocalDateTime now = LocalDateTime.now();

        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByUser(user);
        PasswordResetToken resetToken;
        String nuevoToken = UUID.randomUUID().toString();

        if (tokenOpt.isPresent()) {
            resetToken = tokenOpt.get();
            // Calculamos cuánto tiempo ha pasado desde el último envío
            // (Asumimos que expiryDate - 15 min es el momento del envío)
            long segundosDesdeUltimo = Duration.between(resetToken.getExpiryDate().minusMinutes(15), now).getSeconds();

            if (resetToken.getAttempts() == 1) {
                // REGLA: Segundo intento solo tras 10 segundos
                if (segundosDesdeUltimo < 10) {
                    throw new RuntimeException("Debes esperar 10 segundos para reenviar.");
                }
                resetToken.setAttempts(2);
            } else if (resetToken.getAttempts() >= 2) {
                // REGLA: Tercer intento (o más) solo tras 5 minutos
                if (segundosDesdeUltimo < 300) { // 300 seg = 5 min
                    throw new RuntimeException("Demasiados intentos. Por seguridad, espera 5 minutos.");
                }
                // Si pasaron los 5 min, reiniciamos el contador a 1 para empezar el ciclo
                resetToken.setAttempts(0);
            }

            resetToken.setToken(nuevoToken);
            resetToken.setExpiryDate(now.plusMinutes(15));
        } else {
            // Primer intento de la historia
            resetToken = new PasswordResetToken();
            resetToken.setUser(user);
            resetToken.setToken(nuevoToken);
            resetToken.setExpiryDate(now.plusMinutes(15));
            resetToken.setAttempts(1);
        }

        tokenRepository.save(resetToken);
        emailService.sendPasswordResetEmail(user.getEmail(), resetPasswordBaseUrl + nuevoToken);
    }

    @Transactional
    public void processResetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("El enlace es inválido o ha expirado."));

        // 2. Comprobamos caducidad
        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("El enlace ha caducado.");
        }

        // 3. Actualizamos la contraseña del usuario
        User user = resetToken.getUser();
        user.setPassword(passwordEncoderConfig.passwordEncoder().encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }


}