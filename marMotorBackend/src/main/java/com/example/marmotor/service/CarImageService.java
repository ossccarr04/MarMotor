package com.example.marmotor.service;

import com.example.marmotor.model.entity.Car;
import com.example.marmotor.model.entity.CarImage;
import com.example.marmotor.repository.CarImageRepository;
import com.example.marmotor.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Servicio que gestiona las imágenes de los coches, permitiendo guardarlas, asignarlas a un vehículo, eliminarlas y alternar cuál es la foto principal mediante una transacción.
@Service
public class CarImageService {

    @Autowired
    private CarImageRepository carImageRepository;

    @Autowired
    private CarRepository carRepository;

    public CarImage saveImage(CarImage image) {
        return carImageRepository.save(image);
    }

    public CarImage addImage(Long carId, CarImage image) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Coche no encontrado con ID: " + carId));

        image.setCar(car);
        return carImageRepository.save(image);
    }

    @Transactional
    public void setMainImage(Long imageId, Long carId) {
        List<CarImage> images = carImageRepository.findAll().stream()
                .filter(img -> img.getCar().getId().equals(carId))
                .toList();

        images.forEach(img -> {
            img.setIsMain(img.getId().equals(imageId));
            carImageRepository.save(img);
        });
    }

    public void deleteImage(Long id) {
        carImageRepository.deleteById(id);
    }
}