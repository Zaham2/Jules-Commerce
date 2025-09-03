import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class UpdateAuthDto extends PartialType(CreateUserDto) {}
