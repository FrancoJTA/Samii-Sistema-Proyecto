package com.example.samiii_apiii.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Document(collection = "Factura")
public class Factura {
    @Id
    private String factura_id;

    // Usuario asociado
    private String usuario_id;

    // Medidor asociado
    private String medidor_id;

    // Datos de consumo
    private float lecturaAnterior;
    private float lecturaActual;
    private float consumo;
    private float costoTotal;

    // Datos adicionales
    private LocalDateTime fechaEmision;
    private LocalDateTime fechaVencimiento;
    private boolean pagada;
    private float descuentoSamiicoin; // Descuento aplicado usando Samiicoins

}