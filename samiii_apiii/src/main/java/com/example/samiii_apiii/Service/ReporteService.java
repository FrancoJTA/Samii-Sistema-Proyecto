package com.example.samiii_apiii.Service;

import com.example.samiii_apiii.Entity.Reporte;
import com.example.samiii_apiii.Repository.ReporteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReporteService {
    @Autowired
    private ReporteRepository reporteRepository;

    public List<Reporte> findAll() {
        return reporteRepository.findAll();
    }
    public Optional<Reporte> findById(String id) {
        return reporteRepository.findById(id);
    }
    public Reporte save(Reporte reporte) {
        return reporteRepository.save(reporte);
    }
    public void delete(String id) {
        reporteRepository.deleteById(id);
    }


    //Obtener los reportes de una zona
    public List<Reporte> findByZonaid(String zonaid) {
        return reporteRepository.findByZonaid(zonaid);
    }


    public Reporte update(String id, Reporte reporteDetails) {
        Reporte existingReporte = reporteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reporte no encontrado con id: " + id));

        if (reporteDetails.getTipo() != null) {
            existingReporte.setTipo(reporteDetails.getTipo());
        }
        if (reporteDetails.getDescripcion() != null) {
            existingReporte.setDescripcion(reporteDetails.getDescripcion());
        }
        if (reporteDetails.getFechareporte() != null) {
            existingReporte.setFechareporte(reporteDetails.getFechareporte());
        }
        if (reporteDetails.getFechaAcepta() != null) {
            existingReporte.setFechaAcepta(reporteDetails.getFechaAcepta());
        }
        if (reporteDetails.getFechaCompletado() != null) {
            existingReporte.setFechaCompletado(reporteDetails.getFechaCompletado());
        }
        if (reporteDetails.getEstado() != null) {
            existingReporte.setEstado(reporteDetails.getEstado());
        }
        if (reporteDetails.getZonaid() != null) {
            existingReporte.setZonaid(reporteDetails.getZonaid());
        }
        if (reporteDetails.getMonitor_id() != null) {
            existingReporte.setMonitor_id(reporteDetails.getMonitor_id());
        }
        if (reporteDetails.getSolicitud_id() != null) {
            existingReporte.setSolicitud_id(reporteDetails.getSolicitud_id());
        }
        return reporteRepository.save(existingReporte);
    }
}
