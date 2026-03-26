package com.example.marmotor.controller;

import com.example.marmotor.model.DTO.CarDTO;
import com.example.marmotor.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/me/favorites")
@CrossOrigin(origins = "http://localhost:4200")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<List<CarDTO>> getMyFavorites(Authentication authentication) {
        return ResponseEntity.ok(favoriteService.getUserFavorites(authentication.getName()));
    }

    @PostMapping("/{carId}")
    public ResponseEntity<Void> addFavorite(@PathVariable Long carId, Authentication authentication) {
        favoriteService.addFavorite(authentication.getName(), carId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{carId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long carId, Authentication authentication) {
        favoriteService.removeFavorite(authentication.getName(), carId);
        return ResponseEntity.noContent().build();
    }
}