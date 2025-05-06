package com.hitesh.emailwriterbe;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hitesh.emailwriterbe.dtos.EmailRequestDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient webClient) {
        this.webClient = webClient;
    }


    public ResponseEntity<String> generateEmailReply(EmailRequestDto emailRequestDto){
        // building the prompt for gemini
        String prompt = buildPrompt(emailRequestDto);

        // Craft a request body
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[] {
                                Map.of("text", prompt)
                        })
                }
        );

        // Do request and get response
        String response = webClient.post()
                .uri(geminiApiUrl + "?key=" + geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // return response
        return extractResponseContent(response);
    }

    private ResponseEntity<String> extractResponseContent(String response) {
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            return ResponseEntity.ok(root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText()) ;
        }catch (Exception e){
            return new ResponseEntity<>("Error processing response " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String buildPrompt(EmailRequestDto emailRequestDto){
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional email reply for hte following email content. Please don't generate a subject line ");

        if (emailRequestDto.getTone() != null && !emailRequestDto.getTone().isEmpty()){
            prompt.append("Use a ").append(emailRequestDto.getTone()).append(" tone.");
        }

        prompt.append("\nOriginal email: \n").append(emailRequestDto.getEmailContent());

        return prompt.toString();
    }

}
