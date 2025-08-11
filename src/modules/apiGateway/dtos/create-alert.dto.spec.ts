import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateAlertDto } from './create-alert.dto';

describe('CreateAlertDto', () => {
  it('fails without required fields', async () => {
    const dto = plainToInstance(CreateAlertDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('passes with a valid payload including any supported parameter', async () => {
    const dto = plainToInstance(CreateAlertDto, {
      userId: '66b6e6f0b6c7d5e1a2b3c4d5',
      locationText: 'tel aviv, israel',
      parameter: 'humidity',
      operator: '>=',
      threshold: 60
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
