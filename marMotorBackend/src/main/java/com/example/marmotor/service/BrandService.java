package com.example.marmotor.service;

import com.example.marmotor.model.DTO.BrandDTO;
import com.example.marmotor.model.entity.Brand;
import com.example.marmotor.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;

    public List<BrandDTO> getAllBrands() {
        return brandRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Brand saveBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    private BrandDTO convertToDto(Brand brand) {
        BrandDTO dto = new BrandDTO();
        dto.setId(brand.getId());
        dto.setName(brand.getName());
        dto.setCountry(brand.getCountry());
        return dto;
    }
}