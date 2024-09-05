package com.kh.finalproject.dto.member;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
public class MemberCheckListDTO {
    private List<CheckMemberDTO> memberDTOCheckList = new ArrayList<>();

}
