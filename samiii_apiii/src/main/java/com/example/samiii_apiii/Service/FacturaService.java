package com.example.samiii_apiii.Service;

import com.example.samiii_apiii.Entity.Factura;
import com.example.samiii_apiii.Repository.FacturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FacturaService {
    @Autowired
    private FacturaRepository facturaRepository;

    public List<Factura> findAll() {
        return facturaRepository.findAll();
    }

    public Optional<Factura> findById(String id) {
        return facturaRepository.findById(id);
    }

    public Factura save(Factura factura) {
        return facturaRepository.save(factura);
    }

    public void deleteById(String id) {
        facturaRepository.deleteById(id);
    }
}
