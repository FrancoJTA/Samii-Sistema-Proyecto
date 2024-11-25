package com.example.samiii_apiii.Service;

import com.example.samiii_apiii.Entity.Corte;
import com.example.samiii_apiii.Entity.Corte;
import com.example.samiii_apiii.Entity.Medidor;
import com.example.samiii_apiii.Repository.CorteRepository;
import com.example.samiii_apiii.Repository.FacturaRepository;
import com.example.samiii_apiii.Repository.MedidorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CorteService {

    @Autowired
    private CorteRepository corteRepository;

    @Autowired
    private MedidorService medidorService;

    @Autowired
    private FacturaRepository facturaRepository;

    /**
     * Crea un nuevo corte y actualiza el estado del medidor a inactivo (activo = false).
     */
    public Corte crearCorte(Corte corte) {
        LocalDateTime ahora = LocalDateTime.now();

        // Validar si el medidor existe
        Optional<Medidor> medidorOptional = medidorService.findById(corte.getMedidorId());
        if (medidorOptional.isPresent()) {
            // Guardar el corte
            Corte nuevoCorte = corteRepository.save(corte);

            // Verificar si el corte debe estar activo inmediatamente
            if (corte.getFechaInicio().isBefore(ahora) || corte.getFechaInicio().isEqual(ahora)) {
                medidorService.updateMedidorEstado(corte.getMedidorId(), false);
            }

            return nuevoCorte;
        } else {
            throw new IllegalArgumentException("Medidor no encontrado con ID: " + corte.getMedidorId());
        }
    }

    @Scheduled(fixedRate = 60000) // Revisión cada minuto
    public void verificarEstadoMedidores() {
        LocalDateTime ahora = LocalDateTime.now();

        // Procesar cortes que ya finalizaron
        List<Corte> cortesFinalizados = corteRepository.findByFechaFinBefore(ahora);
        for (Corte corte : cortesFinalizados) {
            Optional<Medidor> medidorOptional = medidorService.findById(corte.getMedidorId());
            if (medidorOptional.isPresent()) {
                Medidor medidor = medidorOptional.get();

                // Verificar si hay facturas vencidas y no pagadas antes de reactivar
                boolean tieneFacturasVencidas = facturaRepository.existsByMedidorIdAndPagadaFalseAndFechaVencimientoBefore(
                        medidor.getMedidor_id(), ahora);

                if (!tieneFacturasVencidas) {
                    // Si no tiene facturas vencidas, reactivar el medidor
                    if (!medidor.isActivo()) {
                        medidorService.updateMedidorEstado(medidor.getMedidor_id(), true);
                    }
                }
            }
        }

        // Procesar cortes actuales
        List<Corte> cortesActivos = corteRepository.findByFechaInicioBeforeAndFechaFinAfter(ahora, ahora);
        for (Corte corte : cortesActivos) {
            Optional<Medidor> medidorOptional = medidorService.findById(corte.getMedidorId());
            if (medidorOptional.isPresent()) {
                Medidor medidor = medidorOptional.get();

                // Si el medidor está activo pero debería estar inactivo, actualizarlo
                if (medidor.isActivo()) {
                    medidorService.updateMedidorEstado(medidor.getMedidor_id(), false);
                }
            }
        }
    }
    /**
     * Obtiene todos los cortes activos en este momento.
     */
    public List<Corte> obtenerCortesActivos() {
        LocalDateTime ahora = LocalDateTime.now();
        return corteRepository.findByFechaInicioBeforeAndFechaFinAfter(ahora, ahora);
    }

    /**
     * Lista todos los cortes asociados a un medidor.
     */
    public List<Corte> obtenerCortesPorMedidor(String medidorId) {
        return corteRepository.findByMedidorId(medidorId);
    }
}