package com.example.samiii_apiii.Controller;

import com.example.samiii_apiii.Entity.ReporteTransformador;
import com.example.samiii_apiii.Service.ConsumoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/transformer")
public class TransformadoresContoller {
    @Autowired
    private ConsumoService consumoService;

    @GetMapping("/zona/{zonaId}")
    public List<ReporteTransformador> obtenerReportesPorZona(@PathVariable String zonaId) {
        return consumoService.obtenerReportesPorZona(zonaId);
    }
}
