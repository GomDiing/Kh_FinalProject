package com.kh.finalproject.service;

import com.kh.finalproject.dto.chart.ChartDTO;
import com.kh.finalproject.entity.Chart;
import com.kh.finalproject.repository.ChartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChartServiceImpl implements ChartService {

    private final ChartRepository chartRepository;

    @Override
    public List<ChartDTO> searchByIndex() {
        List<ChartDTO> chartDTO = new ArrayList<>();
        List<Chart> chartList = chartRepository.findAll();
        for(Chart e : chartList) {
            ChartDTO chartDTO1 = new ChartDTO().toDTO(e);
            chartDTO.add(chartDTO1);
        }
        return chartDTO;
    }
}