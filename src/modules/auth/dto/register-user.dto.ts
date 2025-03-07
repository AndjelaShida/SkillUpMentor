import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator'
import { Match } from 'decorators/match.decorator'
import { Column } from 'typeorm'

export class RegisterUserDto {
  @IsOptional()
  first_name: string

  @IsOptional()
  last_name: string

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
  @Match(RegisterUserDto, (field) => field.password, {
    message: 'Passwords do not match',
  })
  confirm_password: string
}
