package com.kh.finalproject.service;

import com.kh.finalproject.dto.chart.ChartDTO;

import java.util.List;

public interface ChartService {
    List<ChartDTO> searchByIndex();
}