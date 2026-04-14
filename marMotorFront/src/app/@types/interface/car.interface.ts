import { BadgeType } from "../enums/badge.enum";
import { CarDetail } from "./car-details.interface";

export interface CarDTO {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  fuelType: string;
  transmission: string;
  bodyType: string | null;
  power: number; // cv
  mileage: number; // km
  consumption: string;
  badge: BadgeType | null
  badgeType?: BadgeType | null;
  isSaved: boolean
}

