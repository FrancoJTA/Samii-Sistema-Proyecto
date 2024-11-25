package com.example.samiii_apiii.Repository;

import com.example.samiii_apiii.Entity.Medidor;
import com.example.samiii_apiii.Entity.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MedidorRepository extends MongoRepository<Medidor, String> {
    List<Medidor> findByZonaid(String zonaId);
}
