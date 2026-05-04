export enum BadgeType {
    NONE= "none",
    OFFER = "offer",
    NEW = "new",
    RESERVED = "reserved",
    FEATURED = "featured",
    SOLD = "sold",
    

}

export const BadgeLabel: Record<BadgeType, string> = {
  [BadgeType.FEATURED]: 'Novedad',
  [BadgeType.RESERVED]: 'Reservado',
  [BadgeType.OFFER]: 'Oferta',
  [BadgeType.NONE]: 'Ninguno',
  [BadgeType.NEW]: 'Nuevo',
  [BadgeType.SOLD]: 'Vendido'
};