import { AlertsService } from './alerts.service';
import { AlertsRepo } from '../dal/repos/alerts.repo';
import { Types } from 'mongoose';

describe('AlertsService', () => {
  let service: AlertsService;
  let repo: jest.Mocked<AlertsRepo>;

  beforeEach(() => {
    repo = { create: jest.fn(), listAllByUser: jest.fn() } as any;
    service = new AlertsService(repo, {} as any);
  });

  it('creates an alert with ObjectId userId and default units', async () => {
    const dto: any = {
      userId: new Types.ObjectId().toHexString(),
      locationText: 'tel aviv, israel',
      parameter: 'temperature',
      operator: '>',
      threshold: 30
    };
    repo.create.mockResolvedValue({ _id: '1', ...dto, units: 'metric' });

    const result = await service.create(dto);

    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
      userId: expect.any(Types.ObjectId),
      units: 'metric',
      parameter: 'temperature',
      operator: '>',
      threshold: 30
    }));
    expect(result.units).toBe('metric');
  });
});
