package com.example.samiii_apiii.Controller;

import com.example.samiii_apiii.Entity.Reporte;
import com.example.samiii_apiii.Entity.RespuestaReporte;
import com.example.samiii_apiii.Entity.Usuario;
import com.example.samiii_apiii.Service.*;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/respuesta")
public class RespuestaController {

    @Autowired
    private RespuestaService respuestaService;
    @Autowired
    private ReporteService reporteService;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private SolicitudService solicitudService;
    @Autowired
    private MedidorService medidorService;

    @GetMapping
    public List<RespuestaReporte> getAllRespuestaReporte(){
        return respuestaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RespuestaReporte> getRespuestaReporteById(@PathVariable String id){
        return respuestaService.findById(id)
                .map(respuesta -> new ResponseEntity<>(respuesta, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<?> createRespuestaReporte(@RequestBody RespuestaReporte respuestaReporte) {
        try {
            // Verificar si reporte_id está presente
            Optional<Reporte> reporteOptional = reporteService.findById(respuestaReporte.getReporte_id());
            if (!reporteOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Reporte no encontrado con id: " + respuestaReporte.getReporte_id());
            }

            // Obtener el reporte
            Reporte reporte = reporteOptional.get();

            // Generar un nuevo ID para la respuesta
            String respuestaId = new ObjectId().toString();
            respuestaReporte.setRespuesta_id(respuestaId);
            reporte.setRespuesta_id(respuestaId);

            // Actualizar el estado del reporte
            reporte.setEstado("Completado");
            reporte.setFechaCompletado(LocalDateTime.now());
            reporteService.save(reporte);

            // Comprobar si el reporte tiene solicitud_id
            if (reporte.getSolicitud_id() != null && !reporte.getSolicitud_id().isEmpty()) {
                boolean solicitudActualizada = solicitudService.changestatesolicitud(
                        reporte.getSolicitud_id(), "Revisada", ""
                );

                if (!solicitudActualizada) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("No se pudo actualizar el estado de la solicitud con id: " + reporte.getSolicitud_id());
                }
            }

            // Verificar y actualizar el estado del usuario
            Usuario usuario = usuarioService.findById(respuestaReporte.getMonitor_id())
                    .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con id: " + respuestaReporte.getMonitor_id()));
            usuario.setEstado("Libre");
            usuarioService.save(usuario);

            // Verificar si es un reporte de instalación de medidor y respuesta es "Completado Óptimo"
            if ("Instalar Medidor".equalsIgnoreCase(reporte.getTipo())
                    && "Completado Óptimo".equalsIgnoreCase(respuestaReporte.getRespuesta())) {
                // Buscar el medidor y actualizar su estado a activo=true
                boolean medidorActualizado = medidorService.updateMedidorEstado(reporte.getMedidor_id(), true);

                if (!medidorActualizado) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("No se pudo actualizar el estado del medidor con id: " + reporte.getMedidor_id());
                }
            }

            // Guardar la respuesta del reporte
            respuestaReporte.setFechaRespuesta(LocalDateTime.now());
            RespuestaReporte savedRespuestaReporte = respuestaService.save(respuestaReporte);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedRespuestaReporte);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno del servidor: " + e.getMessage());
        }
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<RespuestaReporte> deleteRespuestaReporte(@PathVariable String id){
        respuestaService    .delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
