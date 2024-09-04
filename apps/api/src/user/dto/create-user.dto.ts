export class CreateUserDto {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    imagePath?: string;
    role?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    passive?: boolean;
    deleted?: boolean;
}
