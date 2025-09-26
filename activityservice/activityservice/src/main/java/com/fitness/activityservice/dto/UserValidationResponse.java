package com.fitness.activityservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserValidationResponse {

    @JsonProperty("valid")  // match the exact field name from JSON
    private boolean valid;

}
