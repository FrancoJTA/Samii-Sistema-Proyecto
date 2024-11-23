package com.example.samiii_apiii.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
    private float lecturaAnterior; // Lectura al inicio del periodo
    private float lecturaActual;   // Lectura al final del periodo
    private float consumo;         // Consumo del mes (lecturaActual - lecturaAnterior)
    private float costoTotal;      // Monto total de la factura

    // Datos adicionales
    private Date fechaEmision;     // Fecha de emisión de la factura
    private Date fechaVencimiento; // Fecha límite de pago
    private boolean pagada;        // Estado de pago de la factura
    private float descuentoSamiicoin; // Descuento aplicado usando Samiicoins
}
