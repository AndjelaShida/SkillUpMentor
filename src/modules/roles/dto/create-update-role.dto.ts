import { IsNotEmpty } from 'class-validator'

export class CreateUpdateRoleDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty({ message: 'There shoud be at least one permission selected' })
  permission: string[]
}
