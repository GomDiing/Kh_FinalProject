package com.kh.finalproject.service;

import com.kh.finalproject.dto.statistics.StatisticsDTO;

import java.util.List;

public interface StatisticsService {
    StatisticsDTO selectByIndex(String code);
}
