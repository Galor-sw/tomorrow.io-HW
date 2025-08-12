import { IsMongoId, IsString } from 'class-validator';

export class DeleteAlertDto {
  @IsMongoId()
  @IsString()
  _id!: string;
}
