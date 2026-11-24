import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateReservaDto {
  @IsString({ message: 'O ID da experiência deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A experiência é obrigatória.' })
  experienceId: string;

  @IsInt({ message: 'A quantidade de vagas deve ser um número inteiro.' })
  @Min(1, { message: 'A quantidade mínima para reserva é de 1 vaga.' })
  seats: number;
}
