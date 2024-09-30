import { Transform, Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateLoginDto {

    @IsNotEmpty({ message: 'Email boş olamaz.' })
    @IsEmail()
    @Type(() => String)
    email: string;

    @IsNotEmpty({ message: 'Şifre boş olamaz.' })
    @Type(() => String)
    password: string;

    @IsOptional()
    @Type(() => Boolean)
    @Transform(({ value }) => value === 'true' || value === '1')
    remember?: boolean;
}