package com.example.samiii_apiii.Service;

import com.example.samiii_apiii.Entity.RespuestaReporte;
import com.example.samiii_apiii.Repository.RespuestaReporteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RespuestaService {
    @Autowired
    private RespuestaReporteRepository respuestaReporteRepository;

    public List<RespuestaReporte> findAll() {
        return respuestaReporteRepository.findAll();
    }

    public Optional<RespuestaReporte> findById(String id) {
        return respuestaReporteRepository.findById(id);
    }

    public RespuestaReporte save(RespuestaReporte respuestaReporte) {
        return respuestaReporteRepository.save(respuestaReporte);
    }

    public void delete(String id) {
        respuestaReporteRepository.deleteById(id);
    }
}