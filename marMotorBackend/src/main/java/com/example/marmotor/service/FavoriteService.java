package com.example.marmotor.service;

import com.example.marmotor.model.DTO.CarDTO;
import com.example.marmotor.model.entity.Car;
import com.example.marmotor.model.entity.User;
import com.example.marmotor.repository.CarRepository;
import com.example.marmotor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CarRepository carRepository;
    @Autowired
    private CarService carService;

    @Transactional(readOnly = true)
    public List<CarDTO> getUserFavorites(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return user.getFavoriteCars().stream()
                .map(car -> {
                    CarDTO dto = carService.convertToDto(car);
                    dto.setSaved(true);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void addFavorite(String username, Long carId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Coche no encontrado"));

        user.getFavoriteCars().add(car);
        userRepository.save(user);
    }

    @Transactional
    public void removeFavorite(String username, Long carId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Coche no encontrado"));

        user.getFavoriteCars().remove(car);
        userRepository.save(user);
    }
}