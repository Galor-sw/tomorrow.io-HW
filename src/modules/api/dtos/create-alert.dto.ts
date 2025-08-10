import { IsIn, IsLatitude, IsLongitude, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { ALL_PARAMS, OPERATORS } from '../../dal/types/alert.types';

export class CreateAlertDto {
  @IsMongoId()
  userId!: string;

  @IsString()
  locationText!: string;

  @IsOptional() @IsLatitude()
  lat?: number;

  @IsOptional() @IsLongitude()
  lon?: number;

  @IsIn(ALL_PARAMS as unknown as string[])
  parameter!: string;

  @IsIn(OPERATORS as unknown as string[])
  operator!: string;

  @IsNumber()
  threshold!: number;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsIn(['metric','imperial','kelvin'])
  units?: string;
}
