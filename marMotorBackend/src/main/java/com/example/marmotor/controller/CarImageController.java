package com.example.marmotor.controller;

import com.example.marmotor.model.entity.CarImage;
import com.example.marmotor.service.CarImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Controlador  que gestiona la lista de favoritos de cada usuario autenticado, permitiendo listar sus coches guardados, añadir nuevos o eliminarlos.
@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "https://marmotor.vercel.app")
public class CarImageController {

    @Autowired
    private CarImageService carImageService;

    @PostMapping("/car/{carId}")
    public ResponseEntity<CarImage> addImageToCar(@PathVariable Long carId, @RequestBody CarImage image) {
        return ResponseEntity.ok(carImageService.addImage(carId, image));
    }

    @PatchMapping("/{imageId}/car/{carId}/set-main")
    public ResponseEntity<Void> setMainImage(@PathVariable Long imageId, @PathVariable Long carId) {
        carImageService.setMainImage(imageId, carId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        carImageService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }
}