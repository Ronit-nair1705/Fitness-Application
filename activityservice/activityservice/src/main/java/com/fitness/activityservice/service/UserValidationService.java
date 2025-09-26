package com.fitness.activityservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserValidationService {

    private final WebClient userServiceWebClient;

    /**
     * Validates the user by calling the User Service API.
     * Throws ResponseStatusException if user is invalid or API call fails.
     */
    public void validateUser(String userId) {
        log.info("Calling User Validation API for userId: {}", userId);

        try {
            // If token is needed, set it here
            String accessToken = "";

            // Read raw boolean instead of DTO
            Boolean isValid = userServiceWebClient.get()
                    .uri("/api/users/{userId}/validate", userId)
                    .headers(headers -> {
                        if (!accessToken.isEmpty()) {
                            headers.setBearerAuth(accessToken);
                        }
                    })
                    .retrieve()
                    .bodyToMono(Boolean.class)   // ← read boolean directly
                    .block();

            if (!Boolean.TRUE.equals(isValid)) {
                log.warn("User validation failed for userId: {}", userId);
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid User: " + userId);
            }

            log.info("User validation successful for userId: {}", userId);

        } catch (WebClientResponseException e) {
            log.error("Error calling User Service: {} {}", e.getStatusCode(), e.getResponseBodyAsString());
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found: " + userId);
            } else if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid User: " + userId);
            } else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User Service Error");
            }
        } catch (Exception e) {
            log.error("Unexpected error during user validation", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected User Validation Error");
        }
    }
}
