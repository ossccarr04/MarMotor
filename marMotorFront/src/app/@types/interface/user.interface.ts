export interface UserDTO {
    id: number;
    username: string;
    email: string;
    password: string;
    roles: string[];
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