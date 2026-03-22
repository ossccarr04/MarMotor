package com.example.marmotor.controller;

import com.example.marmotor.model.DTO.BrandDTO;
import com.example.marmotor.model.entity.Brand;
import com.example.marmotor.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "*")
public class BrandController {

    @Autowired
    private BrandService brandService;

    @GetMapping
    public ResponseEntity<List<BrandDTO>> getAllBrands() {
        return ResponseEntity.ok(brandService.getAllBrands());
    }

    @PostMapping
    public ResponseEntity<Brand> createBrand(@RequestBody Brand brand) {
        return ResponseEntity.ok(brandService.saveBrand(brand));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable Long id) {
        return ResponseEntity.noContent().build();
    }
}