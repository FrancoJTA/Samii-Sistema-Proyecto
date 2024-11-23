package com.example.samiii_apiii.Service;

import com.example.samiii_apiii.Entity.HistorialLecturas;
import com.example.samiii_apiii.Repository.HistorialLecturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HistorialLecturaService {
    @Autowired
    private HistorialLecturaRepository historialLecturaRepository;

    public List<HistorialLecturas> findAll(){
        return historialLecturaRepository.findAll();
    }

    public Optional<HistorialLecturas> findById(String id){
        return historialLecturaRepository.findById(id);
    }

    public HistorialLecturas save(HistorialLecturas entity){
        return historialLecturaRepository.save(entity);
    }

    public void delete(String id){
        historialLecturaRepository.deleteById(id);
    }
}
