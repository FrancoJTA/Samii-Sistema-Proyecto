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
        if (zonaDetails.getName() != null) {
            existZona.setName(zonaDetails.getName());
        }
        if (zonaDetails.getLatitud() != null) {
            existZona.setLatitud(zonaDetails.getLatitud());
        }
        if (zonaDetails.getLongitud() != null) {
            existZona.setLongitud(zonaDetails.getLongitud());
        }

        return zonaRepository.save(existZona);
    }

    public Zona findClosestZona(double latitud, double longitud) {
        List<Zona> zonas = zonaRepository.findAll();

        Zona closestZona = null;
        double closestDistance = Double.MAX_VALUE;

        for (Zona zona : zonas) {
            double distance = haversine(latitud, longitud, Double.parseDouble(zona.getLatitud()), Double.parseDouble(zona.getLongitud()));

            if (distance < closestDistance) {
                closestDistance = distance;
                closestZona = zona;
            }
        }

        return closestZona;
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radio de la Tierra en kilómetros

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Retorna la distancia en kilómetros
    }


}