package com.example.marmotor.repository;

import com.example.marmotor.model.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    java.util.Optional<Brand> findByName(String name);
    Optional<Brand> findByNameIgnoreCase(String name);
}