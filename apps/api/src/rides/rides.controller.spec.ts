import { Test, TestingModule } from '@nestjs/testing';
import { RidesController } from './rides.controller';
import { RidesService } from './rides.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

describe('RidesController', () => {
    let controller: RidesController;
    let service: RidesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RidesController],
            providers: [
                {
                    provide: RidesService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findAllByDriver: jest.fn(),
                        startRide: jest.fn(),
                        completeRide: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<RidesController>(RidesController);
        service = module.get<RidesService>(RidesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should be protected with JwtAuthGuard', () => {
            const guards = Reflect.getMetadata('__guards__', controller.create);
            const guard = new (guards[0])();
            expect(guard).toBeInstanceOf(JwtAuthGuard);
        });

        it('should call service.create', async () => {
            const dto = { origin: 'A', destination: 'B' } as any;
            const user = { id: '1' };
            await controller.create(dto, { user });
            expect(service.create).toHaveBeenCalledWith(dto, user);
        });
    });
});
