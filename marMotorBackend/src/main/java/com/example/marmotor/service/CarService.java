package com.example.marmotor.service;

import com.example.marmotor.model.DTO.*;
import com.example.marmotor.model.entity.*;
import com.example.marmotor.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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

    public Optional<CarDetailDTO> getCarDetailById(Long id) {
        return carRepository.findById(id)
                .map(this::convertToDetailDto);
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

    public List<CarDTO> searchCars(String brand, Car.FuelType fuelType, Car.BodyType bodyType, BigDecimal maxPrice) {
        return carRepository.findAll().stream()
                .filter(car -> brand == null || (car.getBrand() != null && car.getBrand().getName().equalsIgnoreCase(brand)))
                .filter(car -> fuelType == null || car.getFuelType() == fuelType)
                .filter(car -> bodyType == null || car.getBodyType() == bodyType)
                .filter(car -> maxPrice == null || car.getPrice().compareTo(maxPrice) <= 0)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private CarDTO convertToDto(Car car) {
        CarDTO dto = new CarDTO();
        dto.setId(car.getId());
        dto.setModel(car.getModel());
        dto.setYear(car.getYear());
        dto.setPrice(car.getPrice());
        dto.setPower(car.getPower());
        dto.setMileage(car.getMileage());
        dto.setConsumption(car.getConsumption());
        dto.setTransmission(car.getTransmission());
        dto.setFuelType(car.getFuelType());
        dto.setBodyType(car.getBodyType());
        dto.setStatus(car.getStatus());
        dto.setDescription(car.getDescription());
        dto.setBadge(car.getBadge());
        dto.setBadgeType(car.getBadgeType());
        dto.setSaved(car.isSaved());

        if (car.getBrand() != null) {
            dto.setMake(car.getBrand().getName());
        }

        if (car.getImages() != null) {
            car.getImages().stream()
                    .filter(img -> img.getIsMain() != null && img.getIsMain())
                    .findFirst()
                    .ifPresent(main -> dto.setImageUrl(main.getUrl()));
        }

        return dto;
    }

    private CarDetailDTO convertToDetailDto(Car car) {
        CarDetail detail = car.getDetail();
        CarDetailDTO dto = new CarDetailDTO();

        dto.setId(car.getId());
        dto.setModel(car.getModel());
        dto.setYear(car.getYear());
        dto.setPrice(car.getPrice());
        dto.setPower(car.getPower());
        dto.setMileage(car.getMileage());
        dto.setConsumption(car.getConsumption());
        dto.setTransmission(car.getTransmission());
        dto.setFuelType(car.getFuelType());
        dto.setBodyType(car.getBodyType());
        dto.setStatus(car.getStatus());
        dto.setBadge(car.getBadge());
        dto.setBadgeType(car.getBadgeType());
        dto.setSaved(car.isSaved());

        if (car.getBrand() != null) {
            dto.setMake(car.getBrand().getName());
        }

        if (detail != null) {
            dto.setColor(detail.getColor());
            dto.setDescription(detail.getDescription());
            dto.setFeatures(detail.getFeatures());

            dto.setHistory(detail.getHistory().stream().map(h -> {
                HistoryEventDTO hDto = new HistoryEventDTO();
                hDto.setYear(h.getYear());
                hDto.setTitle(h.getTitle());
                hDto.setIcon(h.getIcon());
                hDto.setCompleted(h.isCompleted());
                return hDto;
            }).collect(Collectors.toList()));
        }

        if (car.getImages() != null) {
            dto.setImagesAlbum(car.getImages().stream()
                    .map(img -> img.getUrl())
                    .collect(Collectors.toList()));

            car.getImages().stream()
                    .filter(img -> img.getIsMain() != null && img.getIsMain())
                    .findFirst()
                    .ifPresent(main -> dto.setImageUrl(main.getUrl()));
        }

        return dto;
    }
}