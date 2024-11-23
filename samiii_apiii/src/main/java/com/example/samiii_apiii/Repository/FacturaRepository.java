package com.example.samiii_apiii.Repository;

import com.example.samiii_apiii.Entity.Factura;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FacturaRepository extends MongoRepository<Factura, String> {
}
