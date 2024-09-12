export class CreateUserDto {
    name: string;
    email: string;
    password: string;
    email_verified_at: Date;
    remember_token: string;
}
