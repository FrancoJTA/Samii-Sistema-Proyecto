package com.example.samiii_apiii.Controller;

import com.example.samiii_apiii.Entity.Factura;
import com.example.samiii_apiii.Entity.Medidor;
import com.example.samiii_apiii.Service.FacturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Factura")
public class FacturaController {
    @Autowired
    private FacturaService facturaService;

    @GetMapping
    public List<Factura> getAllFacturas(){
        return facturaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Factura> getFacturaById(@PathVariable String id){
        return facturaService.findById(id)
                .map(factura -> new ResponseEntity<>(factura, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public Factura createFactura(@RequestBody Factura factura){
        return facturaService.save(factura);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Factura> updateFactura(@PathVariable String id, @RequestBody Factura factura) {
        return facturaService.findById(id)
                .map(entidadExistente -> {
                    //eso
                    //usuario.setId(id); // Asegurarse de mantener el mismo id
                    return new ResponseEntity<>(facturaService.save(factura), HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFactura(@PathVariable String id) {
        facturaService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
