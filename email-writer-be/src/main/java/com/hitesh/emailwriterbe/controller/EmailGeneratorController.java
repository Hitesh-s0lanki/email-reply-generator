package com.hitesh.emailwriterbe.controller;

import com.hitesh.emailwriterbe.EmailGeneratorService;
import com.hitesh.emailwriterbe.dtos.EmailRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin("*")
public class EmailGeneratorController {

    @Autowired
    private EmailGeneratorService service;

    @PostMapping("generate")
    public ResponseEntity<String> generate(@RequestBody EmailRequestDto emailRequestDto) {
        return service.generateEmailReply(emailRequestDto);
    }
}
