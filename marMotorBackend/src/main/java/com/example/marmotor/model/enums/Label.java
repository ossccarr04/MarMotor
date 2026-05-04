package com.example.marmotor.model.enums;

public enum Label {
    ZERO("0 Emisiones"),
    ECO("ECO"),
    C("C"),
    B("B"),
    NONE("Sin Etiqueta");

    private final String description;

    Label(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}