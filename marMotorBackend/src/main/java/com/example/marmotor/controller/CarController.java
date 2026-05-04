package com.example.marmotor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.marmotor.model.DTO.CarCreateDTO;
import com.example.marmotor.model.DTO.CarDTO;
import com.example.marmotor.model.DTO.CarDetailDTO;
import com.example.marmotor.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "http://localhost:4200")
public class CarController {

    @Autowired
    private CarService carService;

    @GetMapping
    public ResponseEntity<List<CarDTO>> getAllCars() {
        List<CarDTO> cars = carService.getAllCars();
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/filters")
    public ResponseEntity<List<CarDTO>> getCarsByFilters(
            @RequestParam(name="brand", required = false) String brand,
            @RequestParam(name="fuelType",required = false) String fuelType,
            @RequestParam(name="bodyType",required = false) String bodyType,
            @RequestParam(name="maxPrice",required = false) String maxPrice
    ) {
        return ResponseEntity.ok(carService.searchCars(brand, fuelType, bodyType, maxPrice));
    }

    @GetMapping("/detailed")
    public ResponseEntity<List<CarDetailDTO>> getCarsDetailed() {
        List<CarDetailDTO> detailedCars = carService.getAllCarsDetailed();
        return ResponseEntity.ok(detailedCars);
    }

    @GetMapping("/filters/detailed")
    public ResponseEntity<List<CarDetailDTO>> getCarsFilteredDetailed(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String bodyType,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        return ResponseEntity.ok(carService.searchCarsDetailed(brand, fuelType, bodyType, maxPrice));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<CarDetailDTO>> getCarsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(carService.getTop10ByBadge(category));
    }

    @GetMapping("/search/admin")
    public ResponseEntity<List<CarDTO>> searchCarsAdmin(@RequestParam String query) {
        List<CarDTO> results = carService.searchByBrandOrModel(query);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarDTO> getCarById(@PathVariable Long id) {
        return carService.getCarById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<CarDetailDTO> getCarDetail(@PathVariable Long id) {
        return carService.getCarDetailById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CarDTO> updateCar(
            @PathVariable Long id,
            @RequestPart("carData") String carDataJson, // Recibimos el JSON como String para parsearlo
            @RequestPart(value = "images", required = false) MultipartFile[] images) throws IOException {

        // Convertir el String JSON a DTO (Usa ObjectMapper)
        ObjectMapper objectMapper = new ObjectMapper();
        CarCreateDTO carDto = objectMapper.readValue(carDataJson, CarCreateDTO.class);

        return carService.updateCar(id, carDto, images)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CarDTO> createCar(
            @RequestPart("carData") String carDataJson,
            @RequestPart(value = "images", required = false) MultipartFile[] images) {

        try {
            // Convertimos el JSON (String) que viene de Angular a tu CarCreateDTO
            ObjectMapper objectMapper = new ObjectMapper();
            CarCreateDTO carDto = objectMapper.readValue(carDataJson, CarCreateDTO.class);

            // Pasamos el DTO y las imágenes al Servicio (él se encargará de Cloudinary)
            CarDTO savedCar = carService.createCarWithImages(carDto, images);

            return ResponseEntity.ok(savedCar);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.noContent().build();
    }
}