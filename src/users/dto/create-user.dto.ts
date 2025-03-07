import { IsEmail, IsInt, IsNotEmpty, IsOptional, Matches } from 'class-validator'

import { Match } from '../../decorators/match.decorator'

export class CreateUserDto {
  @IsOptional()
  first_name?: string

  @IsOptional()
  last_name?: string

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string

  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password: string

  @IsNotEmpty()
  @Match(CreateUserDto, (dto) => dto.password, {
    message: 'Passwords do not match',
  })
  confirm_password: string

  @IsOptional()
  @IsInt({ message: 'Role ID must be an integer' })
  role_id?: string | null // Dodato polje za `role_id`
}
