package com.example.marmotor.service;

import com.example.marmotor.model.entity.Brand;
import com.example.marmotor.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;

    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    public Brand saveBrand(Brand brand) {
        return brandRepository.save(brand);
    }
}