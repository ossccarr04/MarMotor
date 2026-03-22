package com.example.marmotor.repository;

import com.example.marmotor.model.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByBrandId(Long brandId);
    List<Car> findByStatus(Car.Status status);
}