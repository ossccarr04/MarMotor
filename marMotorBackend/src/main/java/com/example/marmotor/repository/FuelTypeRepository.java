package com.example.marmotor.repository;

import com.example.marmotor.model.entity.Brand;
import com.example.marmotor.model.entity.FuelType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FuelTypeRepository extends JpaRepository<FuelType, Long> {
    Optional<FuelType> findByNameIgnoreCase(String name);

    @Query("SELECT DISTINCT ft FROM FuelType ft " +
            "JOIN Car c ON c.fuelType.id = ft.id " +
            "WHERE (:isSold = true AND c.badge = 'SOLD') " +
            "OR (:isSold = false AND (c.badge != 'SOLD' OR c.badge IS NULL))")
    List<FuelType> findFuelTypesByCarStatus(@Param("isSold") boolean isSold);
}
