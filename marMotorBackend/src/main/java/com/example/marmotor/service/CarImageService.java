package com.example.marmotor.service;

import com.example.marmotor.model.entity.CarImage;
import com.example.marmotor.repository.CarImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CarImageService {

    @Autowired
    private CarImageRepository carImageRepository;

    public CarImage saveImage(CarImage image) {
        return carImageRepository.save(image);
    }

    @Transactional
    public void setMainImage(Long imageId, Long carId) {

        List<CarImage> images = carImageRepository.findAll();



        images.forEach(img -> {
            if (img.getCar().getId().equals(carId)) {
                img.setIsMain(img.getId().equals(imageId));
                carImageRepository.save(img);
            }
        });
    }

    public void deleteImage(Long id) {
        carImageRepository.deleteById(id);
    }
}