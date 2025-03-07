import { User } from 'entities/user.entity'
import { Request } from 'express'

export interface TokenPayload {
  name: string
  sub: string
  type: JwtType // Sada 'type' koristi definisani 'JwtType'
}

export interface RequestWhitUser extends Request {
  user: User
}
export enum JwtType {
  ACCES_TOKEN = 'ACCESS_TOKEN',
}
