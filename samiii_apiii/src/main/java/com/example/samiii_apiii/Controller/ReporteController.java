package com.example.samiii_apiii.Controller;

import com.example.samiii_apiii.Entity.Reporte;
import com.example.samiii_apiii.Entity.Solicitud;
import com.example.samiii_apiii.Entity.Usuario;
import com.example.samiii_apiii.Service.ReporteService;
import com.example.samiii_apiii.Service.SolicitudService;
import com.example.samiii_apiii.Service.UsuarioService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/reporte")
public class ReporteController {
    @Autowired
    private ReporteService reporteService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private SolicitudService solicitudService;

    @GetMapping
    public List<Reporte> getAllReporte(){
        return reporteService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reporte> getReporteById(@PathVariable String id){
        return reporteService.findById(id)
                .map(reporte -> new ResponseEntity<>(reporte, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public Reporte createReporte(@RequestBody Reporte reporte) {
        // Generar un ID manualmente para el reporte
        String reporteId = new ObjectId().toString(); // Utiliza ObjectId si estás usando MongoDB
        reporte.setReporte_id(reporteId);

        // Configurar otros valores iniciales
        reporte.setFechareporte(LocalDateTime.now());
        reporte.setEstado("En Espera");

        // Actualizar la solicitud asociada con el ID del reporte
        boolean resp = true;
        if(reporte.getSolicitud_id()!=null) resp = solicitudService.changestatesolicitud(reporte.getSolicitud_id(), "En Proceso", reporteId);

        if (resp) {
            // Guardar el reporte en la base de datos
            return reporteService.save(reporte);
        } else {
            return null;
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Reporte> updateReporte(@PathVariable String id, @RequestBody Reporte reporte){
        return reporteService.findById(id)
                .map(entidadExistente -> {
                    //eso cambiar
                    //usuario.setId(id); // Asegurarse de mantener el mismo id
                    return new ResponseEntity<>(reporteService.save(reporte), HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Reporte> deleteReporte(@PathVariable String id){
        reporteService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    //Obtener todos los reportes de una zona
    @GetMapping("/find-zona/{zona_id}")
    public ResponseEntity<List<Reporte>> getReporteByZona (@PathVariable String zonaId) {
        try {
            List<Reporte> reportes = reporteService.findByZonaid(zonaId);
            if (reportes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Collections.emptyList());
            }
            return ResponseEntity.ok(reportes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }


    @PostMapping("/aceptar")
    public ResponseEntity<String> AceptarReporte(@RequestBody Map<String, Object> request) {
        try {
            String usuarioId = (String) request.get("usuario_id");
            String reporteId = (String) request.get("reporte_id");

            if (usuarioId == null || reporteId == null) {
                return ResponseEntity.badRequest().body("Los campos 'usuario_id' y 'reporte_id' son obligatorios.");
            }

            Usuario usuario = usuarioService.findById(usuarioId)
                    .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con id: " + usuarioId));

            usuario.setEstado("Ocupado");
            usuarioService.save(usuario);

            Reporte reporte = reporteService.findById(reporteId)
                    .orElseThrow(() -> new IllegalArgumentException("Reporte no encontrado con id: " + reporteId));
            reporte.setEstado("En proceso");
            reporte.setMonitor_id(usuarioId);
            reporte.setFechaAcepta(LocalDateTime.now());
            reporteService.save(reporte);

            return ResponseEntity.ok("Reporte aceptado y asignado al usuario exitosamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno del servidor: " + e.getMessage());
        }
    }
}
