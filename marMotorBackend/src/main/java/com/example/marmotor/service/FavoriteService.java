package com.example.marmotor.service;

import com.example.marmotor.model.DTO.CarDTO;
import com.example.marmotor.model.entity.Car;
import com.example.marmotor.model.entity.User;
import com.example.marmotor.repository.CarRepository;
import com.example.marmotor.repository.UserRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
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
    public List<CarDTO> getUserFavorites(String email) {
        // Usamos la query directa que fuerza la lectura de la tabla intermedia
        List<Car> favoriteCars = userRepository.findFavoriteCarsByUserEmail(email);

        // Los convertimos a DTO y les ponemos el isSaved a true
        return favoriteCars.stream()
                .map(car -> {
                    CarDTO dto = carService.convertToDto(car);
                    dto.setSaved(true);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void addFavorite(String email, Long carId) {

        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            Car car = carRepository.findById(carId)
                    .orElseThrow(() -> new RuntimeException("Coche no encontrado"));

            user.getFavoriteCars().add(car);
            userRepository.saveAndFlush(user);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional
    public void removeFavorite(String email, Long carId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        boolean removed = user.getFavoriteCars().removeIf(c -> c.getId().equals(carId));

        if (removed) {
            userRepository.save(user);
        }
    }
}