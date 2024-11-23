package com.example.samiii_apiii.Service;

import com.example.samiii_apiii.Entity.Zona;
import com.example.samiii_apiii.Repository.ZonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ZonaService {
    @Autowired
    private ZonaRepository zonaRepository;


    public List<Zona> findAll() {
        return zonaRepository.findAll();
    }

    public Optional<Zona> findById(String id) {
        return zonaRepository.findById(id);
    }

    public Zona save(Zona factura) {
        return zonaRepository.save(factura);
    }

    public void deleteById(String id) {
        zonaRepository.deleteById(id);
    }

    public Zona update(String id, Zona zonaDetails){
        Zona existZona = zonaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No se Encontro Zona : " + id));
        if (zonaDetails.getLatitud() != null) {
            existZona.setLatitud(zonaDetails.getLatitud());
        }
        if (zonaDetails.getLongitud() != null) {
            existZona.setLongitud(zonaDetails.getLongitud());
        }

        return zonaRepository.save(existZona);
    }
}