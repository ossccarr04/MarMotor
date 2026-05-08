package com.example.marmotor.service;

import com.example.marmotor.model.DTO.CarCreateDTO;
import com.example.marmotor.model.DTO.CarDTO;
import com.example.marmotor.model.DTO.CarDetailDTO;
import com.example.marmotor.model.DTO.HistoryEventDTO;
import com.example.marmotor.model.entity.Car;
import com.example.marmotor.model.entity.CarDetail;
import com.example.marmotor.model.entity.CarImage;
import com.example.marmotor.model.enums.Label;
import com.example.marmotor.model.entity.*;
import com.example.marmotor.model.enums.Status;
import com.example.marmotor.model.enums.Transmission;
import com.example.marmotor.repository.BodyTypeRepository;
import com.example.marmotor.repository.BrandRepository;
import com.example.marmotor.repository.CarRepository;
import com.example.marmotor.repository.FuelTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
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
    @Autowired
    private BrandService brandService;

    /* ==========================================================================
       MÉTODOS DE CONSULTA
       ========================================================================== */

    public List<CarDTO> getAllCars() {
        return carRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<CarDetailDTO> getAllCarsDetailed() {
        return carRepository.findAll().stream()
                .map(this::convertToDetailDto)
                .collect(Collectors.toList());
    }

    public Optional<CarDTO> getCarById(Long id) {
        return carRepository.findById(id).map(this::convertToDto);
    }

    public Optional<CarDetailDTO> getCarDetailById(Long id) {
        return carRepository.findById(id).map(this::convertToDetailDto);
    }

    public List<CarDTO> searchByBrandOrModel(String query) {

        if (query == null || query.trim().isEmpty()) return Collections.emptyList();

        // Reemplaza múltiples espacios por uno solo: "Porsche    911" -> "Porsche 911"
        String cleanedQuery = query.trim().replaceAll("\\s+", " ");

        return carRepository.findByFullSearch(cleanedQuery)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /* ==========================================================================
       OPERACIONES DE PERSISTENCIA (CREATE / UPDATE / DELETE)
       ========================================================================== */

    @Transactional
    public CarDTO createCarWithImages(CarCreateDTO dto, MultipartFile[] images) throws IOException {
        Car car = new Car();
        mapDtoToEntity(dto, car);

        if (car.getStatus() == null) {
            car.setStatus(Status.AVAILABLE);
        }

        // 1. Subida de imágenes inicial
        if (images != null && images.length > 0) {
            List<CarImage> carImages = new ArrayList<>();
            for (int i = 0; i < images.length; i++) {
                if (images[i] != null && !images[i].isEmpty()) {
                    String url = cloudinaryService.uploadFile(images[i]);
                    CarImage imgEntity = new CarImage();
                    imgEntity.setUrl(url);
                    imgEntity.setIsMain(i == 0);
                    imgEntity.setCar(car);
                    carImages.add(imgEntity);
                }
            }
            car.setImages(carImages);
        }

        // 2. Crear CarDetail y Equipamiento
        CarDetail detail = new CarDetail();
        detail.setColor(dto.getColor());
        detail.setDescription(dto.getDescription());
        detail.setFeatures(dto.getFeatures());
        detail.setCar(car);

        // 3. Mapear Historial (Usando FontAwesome Class)
        if (dto.getHistory() != null) {
            List<HistoryEvent> historyEvents = dto.getHistory().stream().map(hDto -> {
                HistoryEvent event = new HistoryEvent();
                event.setYear(hDto.getYear());
                event.setTitle(hDto.getTitle());
                event.setIcon(hDto.getIcon() != null ? hDto.getIcon() : "fa-wrench");
                event.setCompleted(hDto.isCompleted());
                event.setCar(detail);
                return event;
            }).collect(Collectors.toList());
            detail.setHistory(historyEvents);
        }

        car.setDetail(detail);
        car.setCreatedAt(LocalDateTime.now());

        if(car.getLabel() != null && car.getLabel().name().equalsIgnoreCase(Status.SOLD.toString())){
            car.setSoldAt(LocalDateTime.now());
        }
        Car savedCar = carRepository.save(car);
        return convertToDto(savedCar);
    }

    @Transactional
    public Optional<CarDTO> updateCar(Long id, CarCreateDTO dto, MultipartFile[] images) throws IOException {
        return carRepository.findById(id).map(car -> {
            // 1. Mapear datos básicos
            mapDtoToEntity(dto, car);

            // 2. Actualizar CarDetail e Historial
            CarDetail detail = car.getDetail();
            if (detail == null) {
                detail = new CarDetail();
                detail.setCar(car);
            }
            detail.setColor(dto.getColor());
            detail.setDescription(dto.getDescription());
            detail.setFeatures(dto.getFeatures());

            // Limpiar historial antiguo para evitar duplicados
            if (detail.getHistory() != null) {
                detail.getHistory().clear();
            } else {
                detail.setHistory(new ArrayList<>());
            }

            if (dto.getHistory() != null) {
                for (HistoryEventDTO hDto : dto.getHistory()) {
                    HistoryEvent event = new HistoryEvent();
                    event.setYear(hDto.getYear());
                    event.setTitle(hDto.getTitle());
                    event.setIcon(hDto.getIcon() != null ? hDto.getIcon() : "fa-wrench");
                    event.setCompleted(hDto.isCompleted());
                    event.setCar(detail);
                    detail.getHistory().add(event);
                }
            }
            car.setDetail(detail);

            // 3. Gestión de imágenes (Sincronización Cloudinary)
            List<CarImage> aBorrar = car.getImages().stream()
                    .filter(img -> dto.getExistingImages() == null || !dto.getExistingImages().contains(img.getUrl()))
                    .collect(Collectors.toList());

            for (CarImage img : aBorrar) {
                try {
                    cloudinaryService.deleteFile(img.getUrl());
                } catch (Exception e) {
                    System.err.println("Error al borrar de Cloudinary: " + e.getMessage());
                }
                car.getImages().remove(img);
                img.setCar(null);
            }

            carRepository.saveAndFlush(car); // Sincroniza borrados antes de añadir nuevas

            // 4. Añadir fotos nuevas
            if (images != null && images.length > 0) {
                for (int i = 0; i < images.length; i++) {
                    if (images[i] != null && !images[i].isEmpty()) {
                        try {
                            String url = cloudinaryService.uploadFile(images[i]);
                            CarImage newImg = new CarImage();
                            newImg.setUrl(url);
                            newImg.setIsMain(!hasMainImage(car.getImages()) && i == 0);
                            newImg.setCar(car);
                            car.getImages().add(newImg);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    }
                }
            }
            if(car.getBadge() != null && car.getBadge().toUpperCase().equalsIgnoreCase(Status.SOLD.toString())){
                car.setSoldAt(LocalDateTime.now());
            } else {
                // Si el coche se marca como NO vendido, eliminamos la fecha de venta.
                car.setSoldAt(null);
            }
            return convertToDto(carRepository.save(car));
        });
    }

    @Transactional
    public void deleteCar(Long id) {
        Car car= carRepository.findById(id).orElseThrow();
        Long brandId= car.getBrand().getId();

        carRepository.deleteCarFromAllFavorites(id);
        carRepository.deleteById(id);

        if(!carRepository.existsByBrandId(brandId)){
            brandService.deleteBrand(brandId);
        }


    }

    /* ==========================================================================
       LÓGICA DE BÚSQUEDA Y FILTRADO
       ========================================================================== */

    public List<CarDTO> searchCars(List<String> brands, List<String> fuelTypes, List<String> bodyTypes, String maxPrice) {
        return carRepository.findAll().stream()
                // Si la lista está vacía/tiene "all", deja pasar todos. Si no, comprueba si la marca del coche coincide con alguna de la lista
                .filter(c -> isListEmptyOrAll(brands) ||
                        (c.getBrand() != null && brands.stream().anyMatch(b -> b.equalsIgnoreCase(c.getBrand().getName()))))

                .filter(c -> isListEmptyOrAll(fuelTypes) ||
                        (c.getFuelType() != null && fuelTypes.stream().anyMatch(f -> f.equalsIgnoreCase(c.getFuelType().getName()))))

                .filter(c -> isListEmptyOrAll(bodyTypes) ||
                        (c.getBodyType() != null && bodyTypes.stream().anyMatch(b -> b.equalsIgnoreCase(c.getBodyType().getName()))))

                .filter(c -> isNullOrEmpty(maxPrice) ||
                        (c.getPrice() != null && c.getPrice().compareTo(new BigDecimal(maxPrice)) <= 0))

                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /* ==========================================================================
       MÉTODOS AUXILIARES DE CONVERSIÓN (ENTITY <-> DTO)
       ========================================================================== */

    private void mapDtoToEntity(CarCreateDTO dto, Car car) {
        car.setModel(dto.getModel());
        car.setYear(dto.getYear());
        car.setPrice(dto.getPrice());
        car.setPower(dto.getPower());
        car.setMileage(dto.getMileage());
        car.setConsumption(dto.getConsumption());
        car.setBadge(dto.getBadge());
        car.setBadgeType(dto.getBadgeType());
        car.setDescription(dto.getDescription());
        if (dto.getLabel() != null) {
            car.setLabel(Label.valueOf(dto.getLabel().toUpperCase()));
        }

        if (dto.getTransmission() != null) {
            // Usamos nuestro método seguro del Enum
            car.setTransmission(Transmission.fromString(dto.getTransmission()));
        }

        // Buscar o crear Marca
        if (dto.getBrandName() != null) {
            car.setBrand(brandRepository.findByNameIgnoreCase(dto.getBrandName())
                    .orElseGet(() -> {
                        Brand newBrand = new Brand();
                        newBrand.setName(dto.getBrandName()); // Usamos el setter
                        return brandRepository.save(newBrand);
                    }));
        }

// --- LÓGICA DE BUSCAR O CREAR (COMBUSTIBLE) ---
        if (dto.getFuelTypeName() != null) {
            car.setFuelType(fuelTypeRepository.findByNameIgnoreCase(dto.getFuelTypeName())
                    .orElseGet(() -> {
                        FuelType newFuel = new FuelType();
                        newFuel.setName(dto.getFuelTypeName()); // Usamos el setter
                        return fuelTypeRepository.save(newFuel);
                    }));
        }

// --- LÓGICA DE BUSCAR O CREAR (CARROCERÍA) ---
        if (dto.getBodyTypeName() != null) {
            car.setBodyType(bodyTypeRepository.findByNameIgnoreCase(dto.getBodyTypeName())
                    .orElseGet(() -> {
                        BodyType newBody = new BodyType();
                        newBody.setName(dto.getBodyTypeName()); // Usamos el setter
                        return bodyTypeRepository.save(newBody);
                    }));
        }
    }

    public CarDTO convertToDto(Car car) {
        CarDTO dto = new CarDTO();
        dto.setId(car.getId());
        dto.setModel(car.getModel());
        dto.setYear(car.getYear());
        dto.setBadge(car.getBadge());
        dto.setBadgeType(car.getBadgeType());
        dto.setPrice(car.getPrice());
        dto.setPower(car.getPower());
        dto.setMileage(car.getMileage());
        dto.setConsumption(car.getConsumption());
        dto.setTransmission(car.getTransmission() != null ? car.getTransmission().name() : null);
        dto.setStatus(car.getStatus() != null ? car.getStatus().name() : null);
        dto.setDescription(car.getDescription());
        dto.setSaved(car.isSaved());
        dto.setCreatedAt(car.getCreatedAt());
        dto.setSoldAt(car.getSoldAt());

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

        // Copiar campos básicos
        dto.setId(basic.getId());
        dto.setMake(basic.getMake());
        dto.setModel(basic.getModel());
        dto.setYear(basic.getYear());
        dto.setPrice(basic.getPrice());
        dto.setPower(basic.getPower());
        dto.setMileage(basic.getMileage());
        dto.setImageUrl(basic.getImageUrl());
        dto.setConsumption(basic.getConsumption());
        dto.setTransmission(basic.getTransmission());
        dto.setFuelType(basic.getFuelType());
        dto.setBodyType(basic.getBodyType());
        dto.setStatus(basic.getStatus());
        dto.setLabel(basic.getLabel());
        dto.setBadge(basic.getBadge());
        dto.setBadgeType(basic.getBadgeType());
        dto.setSaved(basic.isSaved());
        dto.setCreatedAt(basic.getCreatedAt());
        dto.setSoldAt(basic.getSoldAt());

        if (detail != null) {
            dto.setColor(detail.getColor());
            dto.setDescription(detail.getDescription());
            dto.setFeatures(detail.getFeatures());
            dto.setHistory(detail.getHistory().stream().map(h -> {
                HistoryEventDTO hDto = new HistoryEventDTO();
                hDto.setYear(h.getYear());
                hDto.setTitle(h.getTitle());
                hDto.setIcon(h.getIcon());
                hDto.setIsCompleted(h.isCompleted());
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

    public List<CarDetailDTO> searchCarsDetailed(List<String> brands, List<String> fuelTypes, List<String> bodyTypes, String maxPrice) {
        return carRepository.findAll().stream()
                .filter(c -> isListEmptyOrAll(brands) ||
                        (c.getBrand() != null && brands.stream().anyMatch(b -> b.equalsIgnoreCase(c.getBrand().getName()))))

                .filter(c -> isListEmptyOrAll(fuelTypes) ||
                        (c.getFuelType() != null && fuelTypes.stream().anyMatch(f -> f.equalsIgnoreCase(c.getFuelType().getName()))))

                .filter(c -> isListEmptyOrAll(bodyTypes) ||
                        (c.getBodyType() != null && bodyTypes.stream().anyMatch(b -> b.equalsIgnoreCase(c.getBodyType().getName()))))

                .filter(c -> isNullOrEmpty(maxPrice) ||
                        (c.getPrice() != null && c.getPrice().compareTo(new BigDecimal(maxPrice)) <= 0))

                .map(this::convertToDetailDto)
                .collect(Collectors.toList());
    }

    public List<CarDetailDTO> getTop10ByBadge(String label) {
        return carRepository.findAll().stream()
                .filter(car -> car.getBadge() != null && car.getBadge().equalsIgnoreCase(label))
                .limit(10)
                .map(this::convertToDetailDto)
                .collect(Collectors.toList());
    }
    private boolean hasMainImage(List<CarImage> images) {
        return images.stream().anyMatch(img -> img.getIsMain() != null && img.getIsMain());
    }

    private boolean isListEmptyOrAll(List<String> list) {
        if (list == null || list.isEmpty()) return true;
        return list.stream().anyMatch(item -> item.equalsIgnoreCase("all"));
    }

    private boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty() || str.equalsIgnoreCase("all");
    }
}