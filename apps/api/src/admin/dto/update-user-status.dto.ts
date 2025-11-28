import { IsString, IsEnum } from 'class-validator';

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    BANNED = 'BANNED'
}

export class UpdateUserStatusDto {
    @IsEnum(UserStatus)
    status: UserStatus;
}
