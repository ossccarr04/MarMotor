package com.example.marmotor.service;

import com.example.marmotor.model.DTO.CarDTO;
import com.example.marmotor.model.DTO.CarImageDTO;
import com.example.marmotor.model.entity.Car;
import com.example.marmotor.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    public List<CarDTO> getAllCars() {
        return carRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<CarDTO> getCarById(Long id) {
        return carRepository.findById(id).map(this::convertToDto);
    }

    public Car createCar(Car car) {
        if (car.getStatus() == null) {
            car.setStatus(Car.Status.AVAILABLE);
        }
        return carRepository.save(car);
    }

    public void deleteCar(Long id) {
        carRepository.deleteById(id);
    }

    private CarDTO convertToDto(Car car) {
        CarDTO dto = new CarDTO();
        dto.setId(car.getId());
        dto.setModel(car.getModel());
        dto.setYear(car.getYear());
        dto.setPrice(car.getPrice());
        dto.setStatus(car.getStatus());
        dto.setDescription(car.getDescription());

        if (car.getBrand() != null) {
            dto.setBrandName(car.getBrand().getName());
        }

        if (car.getImages() != null) {
            dto.setImages(car.getImages().stream()
                    .map(img -> {
                        CarImageDTO imgDto = new CarImageDTO();
                        imgDto.setId(img.getId());
                        imgDto.setUrl(img.getUrl());
                        imgDto.setIsMain(img.getIsMain());
                        return imgDto;
                    })
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}