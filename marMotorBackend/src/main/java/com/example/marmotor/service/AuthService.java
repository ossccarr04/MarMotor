package com.example.marmotor.service;

import com.example.marmotor.config.PasswordEncoderConfig;
import com.example.marmotor.exception.ThrottledException;
import com.example.marmotor.model.DTO.AuthDTO.AuthResponse;
import com.example.marmotor.model.DTO.AuthDTO.LoginRequest;
import com.example.marmotor.model.entity.PasswordResetToken;
import com.example.marmotor.model.entity.User;
import com.example.marmotor.repository.PasswordResetTokenRepository;
import com.example.marmotor.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Key;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;
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

    // Inyectamos los nuevos servicios
    @Autowired
    private LoginAttemptService loginAttemptService;

    @Autowired
    private IpAddressService ipAddressService;

    @Value("${jwt.secret}")
    private String secret;

    @Value("${app.frontend.reset-password-url}")
    private String resetPasswordBaseUrl;

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("No se ha podido completar el registro con los datos proporcionados. Por favor, verifica tu información o, si ya tienes una cuenta, intenta iniciar sesión.");
        }

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("No se ha podido completar el registro con los datos proporcionados. Por favor, verifica tu información o, si ya tienes una cuenta, intenta iniciar sesión.");
        }
        user.setPassword(passwordEncoderConfig.passwordEncoder().encode(user.getPassword()));
        if (user.getRole() == null) user.setRole(User.Role.USER);
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        String ip = ipAddressService.getClientIp(httpRequest);

        if (loginAttemptService.isBlocked(ip)) {
            throw new ThrottledException("Cliente bloqueado por demasiados intentos fallidos.");
        }

        try {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado o credenciales incorrectas"));

            if (!passwordEncoderConfig.passwordEncoder().matches(request.getPassword(), user.getPassword())) {
                throw new BadCredentialsException("Usuario no encontrado o credenciales incorrectas");
            }

            loginAttemptService.loginSucceeded(ip);

            String token = Jwts.builder()
                    .setSubject(user.getEmail())
                    .claim("user", user.getUsername())
                    .claim("role", user.getRole().name())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                    .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                    .compact();

            return new AuthResponse(token, user.getEmail(), user.getRole().name());

        } catch (BadCredentialsException e) {
            // Si el login falla, registramos el intento fallido
            loginAttemptService.loginFailed(ip);
            // Volvemos a lanzar la excepción para que Spring Security devuelva un 401/403
            throw e;
        }
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

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
            long segundosDesdeUltimo = Duration.between(resetToken.getExpiryDate().minusMinutes(15), now).getSeconds();

            if (resetToken.getAttempts() == 1) {
                if (segundosDesdeUltimo < 10) {
                    throw new RuntimeException("Debes esperar 10 segundos para reenviar.");
                }
                resetToken.setAttempts(2);
            } else if (resetToken.getAttempts() >= 2) {
                if (segundosDesdeUltimo < 300) { // 300 seg = 5 min
                    throw new RuntimeException("Demasiados intentos. Por seguridad, espera 5 minutos.");
                }
                resetToken.setAttempts(0);
            }

            resetToken.setToken(nuevoToken);
            resetToken.setExpiryDate(now.plusMinutes(15));
        } else {
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

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("El enlace ha caducado.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoderConfig.passwordEncoder().encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }
}
