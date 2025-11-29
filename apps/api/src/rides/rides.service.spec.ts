import { Test, TestingModule } from '@nestjs/testing';
import { RidesService } from './rides.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ride, RideStatus } from './entities/ride.entity';
import { TravelNeedsService } from '../travel-needs/travel-needs.service';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from '../users/entities/user.entity';

describe('RidesService', () => {
    let service: RidesService;
    let mockRidesRepository;
    let mockTravelNeedsService;
    let mockNotificationsService;

    beforeEach(async () => {
        mockRidesRepository = {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((ride) => Promise.resolve({ id: 'ride-123', ...ride })),
            find: jest.fn(),
            findOne: jest.fn(),
        };

        mockTravelNeedsService = {
            findMatchesForTrip: jest.fn().mockResolvedValue([]),
        };

        mockNotificationsService = {
            sendMatchNotification: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RidesService,
                {
                    provide: getRepositoryToken(Ride),
                    useValue: mockRidesRepository,
                },
                {
                    provide: TravelNeedsService,
                    useValue: mockTravelNeedsService,
                },
                {
                    provide: NotificationsService,
                    useValue: mockNotificationsService,
                },
            ],
        }).compile();

        service = module.get<RidesService>(RidesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a ride with correct available_seats', async () => {
            const createRideDto = {
                origin: 'Santiago',
                destination: 'Valparaiso',
                meeting_point: 'Metro Pajaritos',
                final_point: 'Terminal Valpo',
                departure_time: new Date().toISOString(),
                available_seats: 4,
                price_tokens: 10,
            };

            const driver = { id: 'driver-123', first_name: 'John' } as User;

            const result = await service.create(createRideDto, driver);

            expect(mockRidesRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                origin: 'Santiago',
                total_seats: 4,
                available_seats: 4, // Critical check
                status: RideStatus.OPEN,
                driver_id: 'driver-123',
            }));

            expect(mockRidesRepository.save).toHaveBeenCalled();
            expect(result).toHaveProperty('id', 'ride-123');
            expect(result.available_seats).toBe(4);
        });
    });
});
