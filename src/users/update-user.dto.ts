import { IsEmail, IsOptional, Matches, ValidateIf } from 'class-validator'

import { Match } from '../decorators/match.decorator'

export class UpdateUserDto {
  @IsOptional()
  first_name?: string

  @IsOptional()
  last_name?: string

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string

  @IsOptional()
  role_id?: string

  @IsOptional()
  avatar?: string

  @ValidateIf((o) => typeof o.password === 'string' && o.password.length > 0)
  @IsOptional()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password?: string

  @ValidateIf((o) => typeof o.confirm_password === 'string' && o.confirm_password.length > 0)
  @IsOptional()
  @Match(UpdateUserDto, (field) => field.password, {
    message: 'Passwords do not match',
  })
  confirm_password?: string
}
