package com.kh.finalproject.entity.enumurate;

import com.fasterxml.jackson.annotation.JsonValue;

public interface Status {
    @JsonValue
    String getStatus();
}
