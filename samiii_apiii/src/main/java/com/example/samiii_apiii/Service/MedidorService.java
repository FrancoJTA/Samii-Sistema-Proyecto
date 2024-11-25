package com.example.samiii_apiii.Service;

import com.example.samiii_apiii.Entity.Medidor;
import com.example.samiii_apiii.Entity.Usuario;
import com.example.samiii_apiii.Repository.MedidorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedidorService {
    @Autowired
    private MedidorRepository medidorRepository;

    public List<Medidor> findAll() {
        return medidorRepository.findAll();
    }

    public Optional<Medidor> findById(String id) {
        return medidorRepository.findById(id);
    }

    public Medidor save(Medidor medidor) {
        return medidorRepository.save(medidor);
    }

    public void deleteById(String id) {
        medidorRepository.deleteById(id);
    }

    public boolean updateMedidorEstado(String medidorId, boolean activo) {
        Optional<Medidor> medidorOptional = medidorRepository.findById(medidorId);

        if (medidorOptional.isPresent()) {
            Medidor medidor = medidorOptional.get();
            medidor.setActivo(activo);
            medidorRepository.save(medidor);
            return true;
        }

        return false;
    }

    public List<Medidor> findByZonaid(String zonaid) {
        return medidorRepository.findByZonaid(zonaid);
    }

}