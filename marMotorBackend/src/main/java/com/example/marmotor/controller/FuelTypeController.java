package com.example.marmotor.controller;

import com.example.marmotor.model.DTO.FuelTypeDTO;
import com.example.marmotor.service.FuelTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Endpoint que devuelve a la web los tipos de combustible (Diésel, Gasolina, ECO, etc.) activos, filtrando según queden coches en stock o ya se hayan vendido.
@RestController
@RequestMapping("/api/fuel-types")
@CrossOrigin(origins = "https://marmotor.vercel.app")
public class FuelTypeController {
    @Autowired
    private FuelTypeService fuelTypeService;

    @GetMapping("/active")
    public ResponseEntity<List<FuelTypeDTO>> getFuelTypes(@RequestParam(name = "isSold", defaultValue = "false") boolean isSold) {
        return ResponseEntity.ok(fuelTypeService.getAllFuelTypes(isSold));
    }
}