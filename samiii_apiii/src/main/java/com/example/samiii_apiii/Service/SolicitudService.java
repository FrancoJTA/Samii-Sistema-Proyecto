package com.example.samiii_apiii.Service;
import com.example.samiii_apiii.Entity.Solicitud;
import com.example.samiii_apiii.Entity.Usuario;
import com.example.samiii_apiii.Entity.prop_medidor;
import com.example.samiii_apiii.Repository.SolicitudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SolicitudService {

    //Agregar Enviar Correo de Confirmacion de Envio de Solicitud

    @Autowired
    private SolicitudRepository solicitudRepository;

    public List<Solicitud> findAll() {
        return solicitudRepository.findAll();
    }


    public Optional<Solicitud> findById(String id) {
        return solicitudRepository.findById(id);
    }


    public Solicitud save(Solicitud solicitud) {
        return solicitudRepository.save(solicitud);
    }


    public void deleteById(String id) {
        solicitudRepository.deleteById(id);
    }



    //Cambiar estado de la solicitud
    public boolean changestatesolicitud(String soli, String state, String reporte) {
        Optional<Solicitud> solicitudOpt = solicitudRepository.findById(soli);

        if (solicitudOpt.isPresent()) {
            Solicitud solicitud = solicitudOpt.get();

            // Solo asignar el reporte_id si el estado es "En Proceso"
            if (state.equals("En Proceso")) {
                solicitud.setReporte_id(reporte);
            }

            // Actualizar el estado
            solicitud.setEstado(state);

            // Guardar los cambios en la solicitud
            solicitudRepository.save(solicitud);
            return true;
        }

        return false; // Si la solicitud no existe
    }



    public Solicitud update(String id, Solicitud solicitudDetails) {
        Solicitud existingSolicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada con id: " + id));

        // Actualizar solo los campos no nulos
        if (solicitudDetails.getReporte_id() != null) {
            existingSolicitud.setReporte_id(solicitudDetails.getReporte_id());
        }
        if (solicitudDetails.getTipo() != null) {
            existingSolicitud.setTipo(solicitudDetails.getTipo());
        }
        if (solicitudDetails.getDescripcion() != null) {
            existingSolicitud.setDescripcion(solicitudDetails.getDescripcion());
        }
        if (solicitudDetails.getFechasolicitud() != null) {
            existingSolicitud.setFechasolicitud(solicitudDetails.getFechasolicitud());
        }
        if (solicitudDetails.getEstado() != null) {
            existingSolicitud.setEstado(solicitudDetails.getEstado());
        }
        if (solicitudDetails.getNombre() != null) {
            existingSolicitud.setNombre(solicitudDetails.getNombre());
        }
        if (solicitudDetails.getApellido() != null) {
            existingSolicitud.setApellido(solicitudDetails.getApellido());
        }
        if (solicitudDetails.getCorreo() != null) {
            existingSolicitud.setCorreo(solicitudDetails.getCorreo());
        }
        if (solicitudDetails.getCi() != null) {
            existingSolicitud.setCi(solicitudDetails.getCi());
        }
        if (solicitudDetails.getTelefono() != null) {
            existingSolicitud.setTelefono(solicitudDetails.getTelefono());
        }
        if (solicitudDetails.getLatitud() != null) {
            existingSolicitud.setLatitud(solicitudDetails.getLatitud());
        }
        if (solicitudDetails.getLongitud() != null) {
            existingSolicitud.setLongitud(solicitudDetails.getLongitud());
        }

        return solicitudRepository.save(existingSolicitud);
    }

}
