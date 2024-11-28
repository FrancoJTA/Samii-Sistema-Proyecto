package com.example.samiii_apiii.Service;

import com.example.samiii_apiii.Entity.Factura;
import com.example.samiii_apiii.Entity.Medidor;
import com.example.samiii_apiii.Entity.ReporteTransformador;
import com.example.samiii_apiii.Entity.Zona;
import com.example.samiii_apiii.Repository.FacturaRepository;
import com.example.samiii_apiii.Repository.MedidorRepository;
import com.example.samiii_apiii.Repository.ReporteTransformadorRepository;
import com.example.samiii_apiii.Repository.ZonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ConsumoService {
    @Autowired
    private MedidorRepository medidorRepository;

    @Autowired
    private ZonaRepository zonaRepository;

    @Autowired
    private ReporteTransformadorRepository reporteTransformadorRepository;

    public List<ReporteTransformador> obtenerReportesPorZona(String zonaId) {
        return reporteTransformadorRepository.findByZonaId(zonaId);
    }

    // Método que se ejecuta cada hora para generar el reporte
    //@Scheduled(cron = "0 0 * * * ?") // Ejecuta cada hora
    @Scheduled(cron = "0 0/1 * * * ?") // Ejecuta cada 3 minutos
    public void generarReporteHora() {
        List<Zona> zonas = zonaRepository.findAll();

        for (Zona zona : zonas) {
            List<Medidor> medidoresActivos = medidorRepository.findByZonaidAndActivoTrue(zona.getZona_id());

            float sumaConsumos = 0;
            int cantidadMedidores = 0;

            // Sumar el consumo de cada medidor basado en la última lectura
            for (Medidor medidor : medidoresActivos) {
                // Obtener la última lectura del medidor
                float ultimaLectura = medidor.getLectura();
                // Suponemos que tenemos un campo 'lecturaAnterior' para la lectura anterior
                float lecturaAnterior = medidor.getUltimaLectura();

                // Calcular el consumo en el último periodo (por ejemplo, en las últimas 3 horas)
                float consumoEnPeriodo = ultimaLectura - lecturaAnterior;
                medidor.setUltimaLectura(medidor.getLectura());  // Actualizar la lectura anterior
                medidorRepository.save(medidor);
                // Sumamos el consumo al total
                sumaConsumos += consumoEnPeriodo;
                cantidadMedidores++;
            }

            // Calcular el consumo promedio por medidor
            float consumoPromedio = sumaConsumos / cantidadMedidores;

            // Crear el reporte de consumo
            ReporteTransformador reporte = new ReporteTransformador();
            reporte.setZonaId(zona.getZona_id());
            reporte.setHoraPico(LocalDateTime.now()); // Hora actual cuando se detecta el pico
            reporte.setEstado(calcularEstado(zona, consumoPromedio)); // Estado basado en el consumo
            zona.setEstado(calcularEstado(zona, consumoPromedio));
            zonaRepository.save(zona);

            // Si el estado es "alto rendimiento", calcular el incremento de potencia
            if ("alto rendimiento".equals(reporte.getEstado())) {
                reporte.setIncrementoPotencia(consumoPromedio - zona.getLimiteSuperior());
            } else {
                reporte.setIncrementoPotencia(0);
            }

            // Guardar el reporte
            reporteTransformadorRepository.save(reporte);
        }
    }

    private String calcularEstado(Zona zona, float consumoPromedio) {
        if (consumoPromedio > zona.getLimiteSuperior()) {
            return "alto rendimiento";
        } else if (consumoPromedio < zona.getLimiteInferior()) {
            return "bajo rendimiento";
        } else {
            return "estable";
        }
    }

}
