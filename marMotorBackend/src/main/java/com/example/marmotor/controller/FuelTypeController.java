package com.example.marmotor.controller;

import com.example.marmotor.model.DTO.FuelTypeDTO;
import com.example.marmotor.service.FuelTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fuel-types")
@CrossOrigin(origins = "http://localhost:4200")
public class FuelTypeController {
    @Autowired
    private FuelTypeService fuelTypeService;

    @GetMapping("/active")
    public ResponseEntity<List<FuelTypeDTO>> getFuelTypes(@RequestParam(name = "isSold", defaultValue = "false") boolean isSold) {
        return ResponseEntity.ok(fuelTypeService.getAllFuelTypes(isSold));
    }
}