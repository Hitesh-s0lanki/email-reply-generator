package com.hitesh.emailwriterbe.dtos;

import lombok.Data;

@Data
public class EmailRequestDto {
    private String emailContent;
    private String tone;
}
