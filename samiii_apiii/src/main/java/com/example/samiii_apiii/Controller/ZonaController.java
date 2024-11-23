package com.example.samiii_apiii.Controller;

import com.example.samiii_apiii.Entity.Zona;
import com.example.samiii_apiii.Service.ZonaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/zona")
public class ZonaController {

    @Autowired
    private ZonaService zonaService;

    @GetMapping("/{id}")
    public ResponseEntity<Zona> getZonaById(@PathVariable String id) {
        return zonaService.findById(id)
                .map(Zona -> new ResponseEntity<>(Zona, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Zona> createZona(@RequestBody Zona Zona) {
        try {
            Zona nuevoZona = zonaService.save(Zona);
            return new ResponseEntity<>(nuevoZona, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Zona> updateZona(@PathVariable String id, @RequestBody Zona ZonaDetails) {
        Zona updatedZona = zonaService.update(id, ZonaDetails);
        return ResponseEntity.ok(updatedZona);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteZona(@PathVariable String id) {
        zonaService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
