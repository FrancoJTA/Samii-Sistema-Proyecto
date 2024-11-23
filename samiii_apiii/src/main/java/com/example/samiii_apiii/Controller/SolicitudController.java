package com.example.samiii_apiii.Controller;

import com.example.samiii_apiii.Entity.Solicitud;
import com.example.samiii_apiii.Entity.Usuario;
import com.example.samiii_apiii.Service.SolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/solicitud")
public class    SolicitudController {

    @Autowired
    private SolicitudService solicitudService;

    @GetMapping
    public List<Solicitud> getAllSolicitud() {
        return solicitudService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Solicitud> getSolicitudById(@PathVariable String id) {
        return solicitudService.findById(id)
                .map(solicitud -> new ResponseEntity<>(solicitud, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public Solicitud createSolicitud(@RequestBody Solicitud solicitud) {
        solicitud.setFechasolicitud(LocalDateTime.now());
        solicitud.setEstado("En Espera");
        return solicitudService.save(solicitud);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Solicitud> updateSolicitud(@PathVariable String id, @RequestBody Solicitud solicitud) {
        Solicitud soli = solicitudService.update(id, solicitud);
        return ResponseEntity.ok(soli);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteSolicitud(@PathVariable String id) {
        solicitudService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
