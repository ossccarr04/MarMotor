package com.example.marmotor.model.enums;

public enum Label {
    ZERO("0"),
    ECO("ECO"),
    C("C"),
    B("B"),
    NONE("Sin etiqueta");

    private final String description;

    Label(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}