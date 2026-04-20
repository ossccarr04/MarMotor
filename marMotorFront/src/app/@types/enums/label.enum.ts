export enum Labels {
    ZERO = 'ZERO',
    ECO = 'ECO',
    C = 'C',
    B = 'B',
    NONE = 'NONE'
}

// Para las etiquetas visuales (nombres bonitos), usa un mapeo aparte:
export const LabelDescriptions: Record<Labels, string> = {
    [Labels.ZERO]: '0 Emisiones',
    [Labels.ECO]: 'ECO',
    [Labels.C]: 'C',
    [Labels.B]: 'B',
    [Labels.NONE]: 'Sin Etiqueta'
};