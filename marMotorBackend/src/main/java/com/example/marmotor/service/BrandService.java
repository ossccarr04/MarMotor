package com.example.marmotor.service;

import com.example.marmotor.model.DTO.BrandDTO;
import com.example.marmotor.model.entity.Brand;
import com.example.marmotor.repository.BrandRepository;
import com.example.marmotor.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

// Servicio que gestiona las marcas, controlando el filtrado por stock (disponibles/vendidas), su actualización y la validación de seguridad que impide borrar marcas si tienen coches asignados.
@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private CarRepository carRepository;

    public List<BrandDTO> getAllBrands() {
        return brandRepository.findBrandsWithAvailableCars()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<BrandDTO> getAllBrandsSold() {
        return brandRepository.findBrandsWithSoldCars()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<BrandDTO> updateBrand(Long id, Brand updatedBrand) {
        return brandRepository.findById(id).map(existingBrand -> {
            existingBrand.setName(updatedBrand.getName());

            Brand saved = brandRepository.save(existingBrand);

            return convertToDto(saved);
        });
    }

    public void deleteBrand(Long id) {
        if (carRepository.existsByBrandId(id)) {
            throw new RuntimeException("No se puede borrar: existen coches de esta marca.");
        }
        brandRepository.deleteById(id);
    }

    public Brand saveBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    private BrandDTO convertToDto(Brand brand) {
        BrandDTO dto = new BrandDTO();
        dto.setId(brand.getId());
        dto.setName(brand.getName());
        return dto;
    }
}