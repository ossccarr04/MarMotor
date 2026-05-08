package com.example.marmotor.service;

import com.example.marmotor.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class TokenCleanUpService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;


    // Para que se ejecute a las 2 am
    @Scheduled(cron = "0 0 2 * * *", zone = "Europe/Madrid")
    public void cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        tokenRepository.deleteExpiredTokens(now);
    }
}
