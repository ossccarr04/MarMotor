import { identity } from "rxjs";
import { CarDTO } from "./car.interface";

export interface UserDTO {
    id: number;
    username: string;
    email: string;
    password: string;
    roles: string[];
    favorites: CarDTO[];
    contacts: number;
    createdAt: string;
    updatedAt: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO {
    username: string;
    email: string;
    password: string;
}

export interface LoggedUserDTO {
    user: string;
    correo: string;
    role: string;
}