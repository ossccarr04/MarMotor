package com.example.marmotor.repository;

import com.example.marmotor.model.entity.Brand;
import com.example.marmotor.model.entity.FuelType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FuelTypeRepository extends JpaRepository<FuelType, Long> {
    Optional<FuelType> findByNameIgnoreCase(String name);
}
