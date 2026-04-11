package com.example.marmotor.service;

import com.example.marmotor.model.DTO.CarCreateDTO;
import com.example.marmotor.model.DTO.CarDTO;
import com.example.marmotor.model.DTO.CarDetailDTO;
import com.example.marmotor.model.DTO.HistoryEventDTO;
import com.example.marmotor.model.entity.*;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
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
    @Autowired
    private CloudinaryService cloudinaryService;

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
    public CarDTO createCarWithImages(CarCreateDTO dto, MultipartFile[] images) throws IOException {

        // 1. Crear el coche base y mapear relaciones (Marca, Combustible, etc.)
        Car car = new Car();
        mapDtoToEntity(dto, car);

        if (car.getStatus() == null) {
            car.setStatus(Status.AVAILABLE);
        }

        // 2. Lógica de subida de imágenes
        if (images != null && images.length > 0) {
            List<CarImage> carImages = new ArrayList<>();
            for (int i = 0; i < images.length; i++) {
                MultipartFile file = images[i];

                if (file != null && !file.isEmpty()) {
                    String url = cloudinaryService.uploadFile(file);

                    CarImage imgEntity = new CarImage();
                    imgEntity.setUrl(url);

                    imgEntity.setIsMain(i == 0);

                    imgEntity.setCar(car);
                    carImages.add(imgEntity);
                }
                car.setImages(carImages);
            }
        }

        // 3. Crear y vincular CarDetail (IMPORTANTE)
        CarDetail detail = new CarDetail();
        detail.setColor(dto.getColor());
        detail.setDescription(dto.getDescription());
        detail.setFeatures(dto.getFeatures());
        detail.setCar(car);

        // 4. Mapear el historial del DTO a Entidades
        if (dto.getHistory() != null) {
            List<HistoryEvent> historyEvents = dto.getHistory().stream().map(hDto -> {
                HistoryEvent event = new HistoryEvent();
                event.setYear(hDto.getYear());
                event.setTitle(hDto.getTitle());
                event.setIcon(hDto.getIcon() != null ? hDto.getIcon() : "🔧");
                event.setCompleted(hDto.isCompleted());
                event.setCar(detail); // Vincular al detalle
                return event;
            }).collect(Collectors.toList());
            detail.setHistory(historyEvents);
        }

        car.setDetail(detail);

        // 5. Guardar en Base de Datos
        Car savedCar = carRepository.save(car);

        return convertToDto(savedCar);
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
        car.setBadge(dto.getBadge());
        car.setBadgeType(dto.getBadgeType());

        if (dto.getTransmission() != null) {
            car.setTransmission(Transmission.valueOf(dto.getTransmission().toUpperCase()));
        }

        // --- LÓGICA DE BUSCAR O CREAR (MARCA) ---
        if (dto.getBrandName() != null) {
            Brand brand = brandRepository.findByNameIgnoreCase(dto.getBrandName())
                    .orElseGet(() -> {
                        Brand newBrand = new Brand();
                        newBrand.setName(dto.getBrandName());
                        return brandRepository.save(newBrand);
                    });
            car.setBrand(brand);
        }

        // --- LÓGICA DE BUSCAR O CREAR (COMBUSTIBLE) ---
        if (dto.getFuelTypeName() != null) {
            FuelType fuel = fuelTypeRepository.findByNameIgnoreCase(dto.getFuelTypeName())
                    .orElseGet(() -> {
                        FuelType newFuel = new FuelType();
                        newFuel.setName(dto.getFuelTypeName());
                        return fuelTypeRepository.save(newFuel);
                    });
            car.setFuelType(fuel);
        }

        // --- LÓGICA DE BUSCAR O CREAR (CARROCERÍA) ---
        if (dto.getBodyTypeName() != null) {
            BodyType body = bodyTypeRepository.findByNameIgnoreCase(dto.getBodyTypeName())
                    .orElseGet(() -> {
                        BodyType newBody = new BodyType();
                        newBody.setName(dto.getBodyTypeName());
                        return bodyTypeRepository.save(newBody);
                    });
            car.setBodyType(body);
        }
    }

    public List<CarDTO> searchCars(String brand, String fuelTypeName, String bodyTypeName, String maxPrice) {


        return carRepository.findAll().stream()
                .filter(car -> isNullOrEmpty(brand) ||
                        (car.getBrand() != null && car.getBrand().getName().equalsIgnoreCase(brand)))

                .filter(car -> isNullOrEmpty(fuelTypeName) ||
                        (car.getFuelType() != null && car.getFuelType().getName().equalsIgnoreCase(fuelTypeName)))

                .filter(car -> isNullOrEmpty(bodyTypeName) ||
                        (car.getBodyType() != null && car.getBodyType().getName().equalsIgnoreCase(bodyTypeName)))

                .filter(car -> isNullOrEmpty(maxPrice) ||
                        (car.getPrice() != null && car.getPrice().compareTo(new BigDecimal(maxPrice)) <= 0))

                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Método auxiliar para limpiar el código
    private boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty() || str.equalsIgnoreCase("all");
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
        dto.setBadge(car.getBadge());
        dto.setBadgeType(car.getBadgeType());
        dto.setSaved(car.isSaved());

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
        dto.setBadge(basic.getBadge());
        dto.setBadgeType(basic.getBadgeType());
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

    public List<CarDetailDTO> getTop10ByBadge(String badge) {
        return carRepository.findAll().stream()
                .filter(car -> car.getBadge() != null && car.getBadge().equalsIgnoreCase(badge))
                .limit(10)
                .map(this::convertToDetailDto)
                .collect(Collectors.toList());
    }
}