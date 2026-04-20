package com.example.marmotor.service;

import com.example.marmotor.model.DTO.CarCreateDTO;
import com.example.marmotor.model.DTO.CarDTO;
import com.example.marmotor.model.DTO.CarDetailDTO;
import com.example.marmotor.model.DTO.HistoryEventDTO;
import com.example.marmotor.model.entity.Car;
import com.example.marmotor.model.entity.CarDetail;
import com.example.marmotor.model.entity.CarImage;
import com.example.marmotor.model.enums.Label;
import com.example.marmotor.model.enums.Status;
import com.example.marmotor.model.enums.Transmission;
import com.example.marmotor.repository.BodyTypeRepository;
import com.example.marmotor.repository.BrandRepository;
import com.example.marmotor.repository.CarRepository;
import com.example.marmotor.repository.FuelTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private FuelTypeRepository fuelTypeRepository;
    @Autowired
    private BodyTypeRepository bodyTypeRepository;

    public List<CarDTO> getAllCars() {
        return carRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<CarDTO> getCarById(Long id) {
        return carRepository.findById(id).map(this::convertToDto);
    }

    public Optional<CarDetailDTO> getCarDetailById(Long id) {
        return carRepository.findById(id).map(this::convertToDetailDto);
    }

    @Transactional
    public CarDTO createCar(CarCreateDTO dto) {
        Car car = new Car();
        mapDtoToEntity(dto, car);
        if (car.getStatus() == null) {
            car.setStatus(Status.AVAILABLE);
        }
        return convertToDto(carRepository.save(car));
    }

    public void deleteCar(Long id) {
        carRepository.deleteById(id);
    }

    @Transactional
    public Optional<CarDTO> updateCar(Long id, CarCreateDTO dto) {
        return carRepository.findById(id).map(existingCar -> {
            mapDtoToEntity(dto, existingCar);
            return convertToDto(carRepository.save(existingCar));
        });
    }

    private void mapDtoToEntity(CarCreateDTO dto, Car car) {
        car.setModel(dto.getModel());
        car.setYear(dto.getYear());
        car.setPrice(dto.getPrice());
        car.setPower(dto.getPower());
        car.setMileage(dto.getMileage());
        car.setConsumption(dto.getConsumption());
        car.setDescription(dto.getDescription());
        if (dto.getLabel() != null) {
            car.setLabel(Label.valueOf(dto.getLabel().toUpperCase()));
        }

        if (dto.getTransmission() != null) {
            car.setTransmission(Transmission.valueOf(dto.getTransmission().toUpperCase()));
        }

        car.setBrand(brandRepository.findById(dto.getBrandId())
                .orElseThrow(() -> new EntityNotFoundException("Marca no encontrada")));
        car.setFuelType(fuelTypeRepository.findById(dto.getFuelTypeId())
                .orElseThrow(() -> new EntityNotFoundException("Tipo de combustible no encontrado")));
        car.setBodyType(bodyTypeRepository.findById(dto.getBodyTypeId())
                .orElseThrow(() -> new EntityNotFoundException("Tipo de carrocería no encontrado")));
    }

    public List<CarDTO> searchCars(String brand, String fuelTypeName, String bodyTypeName, BigDecimal maxPrice) {
        return carRepository.findAll().stream()
                .filter(car -> brand == null || (car.getBrand() != null && car.getBrand().getName().equalsIgnoreCase(brand)))
                .filter(car -> fuelTypeName == null || (car.getFuelType() != null && car.getFuelType().getName().equalsIgnoreCase(fuelTypeName)))
                .filter(car -> bodyTypeName == null || (car.getBodyType() != null && car.getBodyType().getName().equalsIgnoreCase(bodyTypeName)))
                .filter(car -> maxPrice == null || car.getPrice().compareTo(maxPrice) <= 0)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public CarDTO convertToDto(Car car) {
        CarDTO dto = new CarDTO();
        dto.setId(car.getId());
        dto.setModel(car.getModel());
        dto.setYear(car.getYear());
        dto.setPrice(car.getPrice());
        dto.setPower(car.getPower());
        dto.setMileage(car.getMileage());
        dto.setConsumption(car.getConsumption());
        dto.setTransmission(car.getTransmission() != null ? car.getTransmission().name() : null);
        dto.setStatus(car.getStatus() != null ? car.getStatus().name() : null);
        dto.setDescription(car.getDescription());

        dto.setSaved(car.isSaved());

        dto.setLabel(car.getLabel() != null ? car.getLabel().getDescription() : null);

        if (car.getFuelType() != null) dto.setFuelType(car.getFuelType().getName());
        if (car.getBodyType() != null) dto.setBodyType(car.getBodyType().getName());
        if (car.getBrand() != null) dto.setMake(car.getBrand().getName());

        if (car.getImages() != null) {
            car.getImages().stream()
                    .filter(img -> img.getIsMain() != null && img.getIsMain())
                    .findFirst()
                    .ifPresent(main -> dto.setImageUrl(main.getUrl()));
        }
        return dto;
    }

    public CarDetailDTO convertToDetailDto(Car car) {
        CarDetail detail = car.getDetail();
        CarDetailDTO dto = new CarDetailDTO();
        CarDTO basic = convertToDto(car);

        dto.setId(basic.getId());
        dto.setMake(basic.getMake());
        dto.setModel(basic.getModel());
        dto.setYear(basic.getYear());
        dto.setPrice(basic.getPrice());
        dto.setImageUrl(basic.getImageUrl());
        dto.setPower(basic.getPower());
        dto.setMileage(basic.getMileage());
        dto.setConsumption(basic.getConsumption());
        dto.setTransmission(basic.getTransmission());
        dto.setFuelType(basic.getFuelType());
        dto.setBodyType(basic.getBodyType());
        dto.setStatus(basic.getStatus());
        dto.setLabel(basic.getLabel());
        dto.setSaved(basic.isSaved());

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
                    .map(CarImage::getUrl)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    public List<CarDetailDTO> getAllCarsDetailed() {
        return carRepository.findAll().stream()
                .map(this::convertToDetailDto)
                .collect(Collectors.toList());
    }

    public List<CarDetailDTO> searchCarsDetailed(String brand, String fuelTypeName, String bodyTypeName, BigDecimal maxPrice) {
        return carRepository.findAll().stream()
                .filter(car -> brand == null || (car.getBrand() != null && car.getBrand().getName().equalsIgnoreCase(brand)))
                .filter(car -> fuelTypeName == null || (car.getFuelType() != null && car.getFuelType().getName().equalsIgnoreCase(fuelTypeName)))
                .filter(car -> bodyTypeName == null || (car.getBodyType() != null && car.getBodyType().getName().equalsIgnoreCase(bodyTypeName)))
                .filter(car -> maxPrice == null || car.getPrice().compareTo(maxPrice) <= 0)
                .map(this::convertToDetailDto)
                .collect(Collectors.toList());
    }

    public List<CarDetailDTO> getTop10ByBadge(String label) {
        return carRepository.findAll().stream()
                .filter(car -> car.getLabel() != null && car.getLabel().name().equalsIgnoreCase(label))
                .limit(10)
                .map(this::convertToDetailDto)
                .collect(Collectors.toList());
    }
}