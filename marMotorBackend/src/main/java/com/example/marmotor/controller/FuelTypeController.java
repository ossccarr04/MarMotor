package com.example.marmotor.controller;

import com.example.marmotor.model.DTO.FuelTypeDTO;
import com.example.marmotor.service.FuelTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/fuel-types")
@CrossOrigin(origins = "http://localhost:4200")
public class FuelTypeController {
    @Autowired
    private FuelTypeService fuelTypeService;

    @GetMapping
    public ResponseEntity<List<FuelTypeDTO>> getFuelTypes() {
        return ResponseEntity.ok(fuelTypeService.getAllFuelTypes());
    }
}