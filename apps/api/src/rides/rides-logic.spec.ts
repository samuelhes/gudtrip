import { Test, TestingModule } from '@nestjs/testing';
import { RidesService } from './rides.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ride, RideStatus } from './entities/ride.entity';
import { TravelNeedsService } from '../travel-needs/travel-needs.service';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from '../users/entities/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('RidesService Logic', () => {
    let service: RidesService;
    let ridesRepository;
    let travelNeedsService;
    let notificationsService;

    const mockUser: User = {
        id: 'driver-1',
        first_name: 'Driver',
        email: 'driver@test.com',
    } as User;

    const mockRideDto = {
        origin: 'City A',
        destination: 'City B',
        departure_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        available_seats: 3,
        price_tokens: 10,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RidesService,
                {
                    provide: getRepositoryToken(Ride),
                    useValue: {
                        create: jest.fn().mockImplementation((dto) => dto),
                        save: jest.fn().mockImplementation((ride) => Promise.resolve({ id: 'ride-1', ...ride })),
                        find: jest.fn(),
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: TravelNeedsService,
                    useValue: {
                        findMatchesForTrip: jest.fn().mockResolvedValue([]),
                    },
                },
                {
                    provide: NotificationsService,
                    useValue: {
                        sendMatchNotification: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<RidesService>(RidesService);
        ridesRepository = module.get(getRepositoryToken(Ride));
        travelNeedsService = module.get(TravelNeedsService);
        notificationsService = module.get(NotificationsService);
    });

    it('should create a ride successfully', async () => {
        const result = await service.create(mockRideDto as any, mockUser);
        expect(result).toBeDefined();
        expect(result.id).toBe('ride-1');
        expect(result.status).toBe(RideStatus.OPEN);
        expect(result.available_seats).toBe(3);
        expect(result.total_seats).toBe(3);
    });

    it('should throw error if departure time is in the past', async () => {
        const pastRideDto = { ...mockRideDto, departure_time: new Date(Date.now() - 86400000).toISOString() };
        await expect(service.create(pastRideDto as any, mockUser)).rejects.toThrow(BadRequestException);
    });

    it('should trigger notifications if matches are found', async () => {
        const matches = [{ user_id: 'user-2' }, { user_id: 'user-3' }];
        travelNeedsService.findMatchesForTrip.mockResolvedValue(matches);

        await service.create(mockRideDto as any, mockUser);

        expect(travelNeedsService.findMatchesForTrip).toHaveBeenCalled();
        expect(notificationsService.sendMatchNotification).toHaveBeenCalledTimes(2);
        expect(notificationsService.sendMatchNotification).toHaveBeenCalledWith('user-2', expect.anything());
        expect(notificationsService.sendMatchNotification).toHaveBeenCalledWith('user-3', expect.anything());
    });
});
