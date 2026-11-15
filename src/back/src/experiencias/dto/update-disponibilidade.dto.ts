import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateDisponibilidadeDto {
  @IsBoolean({ message: 'O campo isAvailable deve ser um booleano (true ou false).' })
  @IsNotEmpty({ message: 'O status de disponibilidade é obrigatório.' })
  isAvailable: boolean;
}
