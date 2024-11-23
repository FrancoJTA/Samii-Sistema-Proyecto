package com.example.samiii_apiii.Controller;

import com.example.samiii_apiii.Entity.HistorialLecturas;
import com.example.samiii_apiii.Service.HistorialLecturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/historiallectura")
public class HistorialLecturaController {
    @Autowired
    private HistorialLecturaService historialLecturaService;

    @GetMapping
    public List<HistorialLecturas> getHistorialLecturas() {
        return historialLecturaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistorialLecturas> getHistorialLectura(@PathVariable String id) {
        return historialLecturaService.findById(id)
                .map(historialLecturas -> new ResponseEntity<>(historialLecturas, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public HistorialLecturas createHistorialLectura(@RequestBody HistorialLecturas historialLectura) {
        return historialLecturaService.save(historialLectura);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistorialLecturas> updateHistorialLectura(@PathVariable String id, @RequestBody HistorialLecturas historialLectura) {
        return historialLecturaService.findById(id)
                .map(entidadExistente ->{
                    //eso
                    return new ResponseEntity<>(historialLecturaService.save(historialLectura), HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HistorialLecturas> deleteHistorialLectura(@PathVariable String id) {
        historialLecturaService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
