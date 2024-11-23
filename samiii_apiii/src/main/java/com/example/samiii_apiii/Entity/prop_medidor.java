package com.example.samiii_apiii.Entity;

import lombok.Data;

@Data
public class prop_medidor {

    private String rol;

    private boolean corte_luz;
    private boolean ver_lectura;
    private boolean pagar_facturas;

    private String medidor_id;

}