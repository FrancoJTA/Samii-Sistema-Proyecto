package com.example.samiii_apiii.Controller;

import com.example.samiii_apiii.Entity.Corte;
import com.example.samiii_apiii.Entity.Medidor;
import com.example.samiii_apiii.Service.CorteService;
import com.example.samiii_apiii.Service.MedidorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
@CrossOrigin("*")
@RestController
@RequestMapping("/cortes")
public class CorteController {

    @Autowired
    private CorteService corteService;

    @GetMapping("/time")
    public ResponseEntity<Map<String, String>> getServerTime() {
        Map<String, String> response = new HashMap<>();
        response.put("serverTime", LocalDateTime.now().toString());
        response.put("zone", ZoneId.systemDefault().toString());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Corte> crearCorte(@RequestBody Corte corte) {
        try {
            Corte nuevoCorte = corteService.crearCorte(corte);
            return new ResponseEntity<>(nuevoCorte, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Obtiene todos los cortes activos en este momento.
     */
    @GetMapping("/activos")
    public ResponseEntity<List<Corte>> obtenerCortesActivos() {
        List<Corte> cortesActivos = corteService.obtenerCortesActivos();
        return new ResponseEntity<>(cortesActivos, HttpStatus.OK);
    }

    /**
     * Obtiene todos los cortes de un medidor específico.
     */
    @GetMapping("/medidor/{medidorId}")
    public ResponseEntity<List<Corte>> obtenerCortesPorMedidor(@PathVariable String medidorId) {
        List<Corte> cortes = corteService.obtenerCortesPorMedidor(medidorId);
        return new ResponseEntity<>(cortes, HttpStatus.OK);
    }
}
