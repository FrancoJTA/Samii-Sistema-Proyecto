package com.example.samiii_apiii.Repository;

import com.example.samiii_apiii.Entity.Medidor;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MedidorRepository extends MongoRepository<Medidor, String> {
}
