package com.example.marmotor.service;

import com.example.marmotor.model.DTO.FuelTypeDTO;
import com.example.marmotor.repository.FuelTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// Servicio de lógica de negocio que obtiene del repositorio los tipos de motorización (Gasolina, Diésel, etc.) según su stock y los convierte a DTO para consumo de la web.
@Service
public class FuelTypeService {
    @Autowired
    private FuelTypeRepository repository;

    public List<FuelTypeDTO> getAllFuelTypes(boolean isSold) {
        return repository.findFuelTypesByCarStatus(isSold).stream().map(ft -> {
            FuelTypeDTO dto = new FuelTypeDTO();
            dto.setId(ft.getId());
            dto.setName(ft.getName());
            return dto;
        }).collect(Collectors.toList());
    }
}