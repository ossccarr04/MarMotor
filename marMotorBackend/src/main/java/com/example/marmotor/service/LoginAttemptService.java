package com.example.marmotor.service;

import com.github.benmanes.caffeine.cache.LoadingCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 3;
    private final LoadingCache<String, Integer> attemptsCache;

    @Autowired
    public LoginAttemptService(LoadingCache<String, Integer> loginAttemptCache) {
        this.attemptsCache = loginAttemptCache;
    }

    public void loginSucceeded(String key) {
        attemptsCache.invalidate(key);
    }


    public void loginFailed(String key) {
        int attempts = attemptsCache.get(key);
        attempts++;
        attemptsCache.put(key, attempts);
    }


    public boolean isBlocked(String key) {
        // Si el número de intentos es mayor o igual al máximo, está bloqueado.
        return attemptsCache.get(key) >= MAX_ATTEMPTS;
    }
}
