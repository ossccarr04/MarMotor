import { CarDTO } from "./car.interface";
import { HistoryEvent } from "./historial-car.interface";

export interface CarDetail extends CarDTO {
  imagesAlbum: string[];
  color: string;
  description: string;
  features: string[];
  history: HistoryEvent[];
}
