package com.kh.finalproject.dto.notice;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class NoticeListDTO {
    private List<CheckDTO> checkDTOList = new ArrayList<>();
}
