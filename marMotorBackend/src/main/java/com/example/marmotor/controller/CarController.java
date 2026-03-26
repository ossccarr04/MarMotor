package com.example.marmotor.controller;

import com.example.marmotor.model.DTO.CarCreateDTO;
import com.example.marmotor.model.DTO.CarDTO;
import com.example.marmotor.model.DTO.CarDetailDTO;
import com.example.marmotor.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String bodyType,
            @RequestParam(required = false) BigDecimal maxPrice
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

    @PutMapping("/{id}")
    public ResponseEntity<CarDTO> updateCar(@PathVariable Long id, @RequestBody CarCreateDTO carDto) {
        return carService.updateCar(id, carDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CarDTO> createCar(@RequestBody CarCreateDTO carDto) {
        return ResponseEntity.ok(carService.createCar(carDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.noContent().build();
    }
}