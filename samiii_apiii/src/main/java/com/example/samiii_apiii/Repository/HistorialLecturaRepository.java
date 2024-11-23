package com.example.samiii_apiii.Repository;

import com.example.samiii_apiii.Entity.HistorialLecturas;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HistorialLecturaRepository extends MongoRepository<HistorialLecturas,String> {
}
