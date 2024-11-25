package com.example.samiii_apiii.Controller;

import com.example.samiii_apiii.Entity.Medidor;
import com.example.samiii_apiii.Entity.Reporte;
import com.example.samiii_apiii.Entity.Usuario;
import com.example.samiii_apiii.Repository.MedidorRepository;
import com.example.samiii_apiii.Service.MedidorService;
import com.example.samiii_apiii.Service.ReporteService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/medidores")
public class MedidorController {
    @Autowired
    private MedidorService medidorService;

    @Autowired
    private ReporteService reporteService;

    @GetMapping
    public List<Medidor> getAllMedidores() {
        return medidorService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medidor> getMedidorById(@PathVariable String id) {
        return medidorService.findById(id)
                .map(medidor -> new ResponseEntity<>(medidor, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public Medidor createMedidor(@RequestBody Medidor medidor) {
        String medidorId = new ObjectId().toString();
        medidor.setActivo(false);
        medidor.setMedidor_id(medidorId);

        Reporte reporte = new Reporte();
        reporte.setFechareporte(LocalDateTime.now());
        reporte.setEstado("En Espera");
        reporte.setMedidor_id(medidorId);
        reporte.setDescripcion("Instalar Medidor para tanto tanto");
        reporte.setTipo("Instalar Medidor");
        reporteService.save(reporte);

        return medidorService.save(medidor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medidor> updateMedidor(@PathVariable String id, @RequestBody Medidor medidor) {
        return medidorService.findById(id)
                .map(entidadExistente -> {
                    return new ResponseEntity<>(medidorService.save(medidor), HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedidor(@PathVariable String id) {
        medidorService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
