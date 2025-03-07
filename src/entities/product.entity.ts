import { Column, Entity } from 'typeorm'

import { Base } from './base.entity'

@Entity()
export class Product extends Base {
  @Column()
  title: string

  @Column()
  description: string

  @Column()
  image: string

  @Column()
  price: number
}
