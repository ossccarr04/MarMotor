package com.example.marmotor.model.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Transmission {
    MANUAL("Manual"),
    AUTOMATICA("Automática");

    private final String description;

    Transmission(String description) {
        this.description = description;
    }

    @JsonValue // Esto hace que al enviar el JSON al Front, use "Automática"
    public String getDescription() {
        return description;
    }

    // Método para convertir strings del Front/DB al Enum de forma segura
    public static Transmission fromString(String text) {
        if (text == null) return null;
        String normalized = text.toUpperCase()
                .replace("Á", "A")
                .trim();
        for (Transmission t : Transmission.values()) {
            if (t.name().equalsIgnoreCase(normalized)) {
                return t;
            }
        }
        return null;
    }
}