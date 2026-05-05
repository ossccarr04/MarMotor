package com.example.marmotor.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
public class ThrottledException extends RuntimeException {
    public ThrottledException(String message) {
        super(message);
    }
}