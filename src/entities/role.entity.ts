import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'

import { Base } from './base.entity'
import { Permission } from './permission.entity' // Pretpostavljam da postoji entitet Permission

@Entity()
export class Role extends Base {
  @Column()
  name: string

  // Ako obrišemo red u ManyToMany tabeli, obrišiće sve role unutar te tabele
  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable({
    name: 'role_permission',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' }, // Promenio sam ovo na 'permission_id'
  })
  permissions: Permission[]
}
