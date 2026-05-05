package com.example.marmotor.repository;

import com.example.marmotor.model.entity.Car;
import com.example.marmotor.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {


    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    @Query("SELECT c FROM User u JOIN u.favoriteCars c WHERE u.email = :email")
    List<Car> findFavoriteCarsByUserEmail(@Param("email") String email);

    boolean existsByEmail(String email);
}
