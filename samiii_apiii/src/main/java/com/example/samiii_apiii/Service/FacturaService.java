package com.example.samiii_apiii.Service;

import com.example.samiii_apiii.Entity.Factura;
import com.example.samiii_apiii.Entity.Medidor;
import com.example.samiii_apiii.Repository.FacturaRepository;
import com.example.samiii_apiii.Repository.MedidorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FacturaService {
    @Autowired
    private MedidorRepository medidorRepository;

    @Autowired
    private FacturaRepository facturaRepository;

    @Scheduled(cron = "0 0 0 1 * ?") // Ejecuta el primer día de cada mes a medianoche
    public void generarFacturasMensuales() {
        List<Medidor> medidores = medidorRepository.findAll(); // Consulta todos los medidores
        LocalDateTime fechaActual = LocalDateTime.now();
        LocalDateTime fechaVencimiento = fechaActual.plusDays(15); // Fecha de vencimiento: 15 días después

        for (Medidor medidor : medidores) {

            if(medidor.isActivo()){
                Optional<Factura> ultimaFactura = facturaRepository
                        .findTopByMedidorIdOrderByFechaEmisionDesc(medidor.getMedidor_id());

                float lecturaAnterior = ultimaFactura.map(Factura::getLecturaActual).orElse(0.0f);

                // Crear la factura
                Factura factura = new Factura();
                factura.setMedidorId(medidor.getMedidor_id());
                factura.setLecturaAnterior(lecturaAnterior);
                factura.setLecturaActual(medidor.getLectura());

                float consumo = factura.getLecturaActual() - factura.getLecturaAnterior();

                if (consumo > 0) {
                    factura.setConsumo(consumo);
                    factura.setGenerado(0);
                    factura.setCostoTotal(calcularCosto(consumo));
                } else {
                    factura.setConsumo(0);
                    factura.setGenerado(Math.abs(consumo));

                    factura.setGen_samii_coin(0); // esto es en base a la diferencia
                }

                // Configura otras propiedades
                factura.setFechaEmision(fechaActual);
                factura.setFechaVencimiento(fechaVencimiento);

                factura.setPagada(false);
                if(consumo<=0){
                    factura.setPagada(true);
                    factura.setFechaPagado(fechaActual);
                }


                factura.setDescuentoSamiicoin(0);
                factura.setUsoSamiiCoins(false);

                // Guarda la factura en la base de datos
                facturaRepository.save(factura);
            }
        }
    }
    private float calcularCosto(float consumo) {
        // Implementa la lógica de cálculo del costo (ej. tarifa fija por unidad)
        float tarifa = 0.15f; // Ejemplo: $0.15 por unidad de energía
        return consumo * tarifa;
    }

    public List<Factura> obtenerFacturasPorMedidorId(String medidorId) {
        return facturaRepository.findByMedidorId(medidorId);
    }

    public List<Factura> obtenerTodasLasFacturas() {
        return facturaRepository.findAll();
    }

    //@Scheduled(cron = "0 0 0 * * ?") // Ejecuta diariamente a medianoche
    @Scheduled(cron = "0 * * * * ?") // Ejecuta cada minuto
    public void desactivarMedidoresPorFacturasImpagas() {
        LocalDateTime fechaActual = LocalDateTime.now();

        // Buscar facturas que no estén pagadas y cuya fecha de vencimiento haya pasado
        List<Factura> facturasImpagas = facturaRepository.findByPagadaFalseAndFechaVencimientoBefore(fechaActual);

        for (Factura factura : facturasImpagas) {
            // Buscar el medidor asociado a la factura
            Optional<Medidor> medidorOptional = medidorRepository.findById(factura.getMedidorId());

            if (medidorOptional.isPresent()) {
                Medidor medidor = medidorOptional.get();

                // Cambiar el estado del medidor a inactivo
                medidor.setActivo(false);
                medidorRepository.save(medidor); // Guardar cambios en la base de datos
            }
        }
    }

    public Optional<Factura> obtenerFacturaPorId(String facturaId) {
        return facturaRepository.findById(facturaId);
    }

    public Factura guardarFactura(Factura factura) {
        return facturaRepository.save(factura);
    }
}