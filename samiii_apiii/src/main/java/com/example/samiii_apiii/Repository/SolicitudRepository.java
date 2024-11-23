package com.example.samiii_apiii.Repository;

import com.example.samiii_apiii.Entity.Solicitud;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SolicitudRepository extends MongoRepository<Solicitud, String> {
}
