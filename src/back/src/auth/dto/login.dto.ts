import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Formato de email inválido.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Informe a senha.' })
  password: string;
}
