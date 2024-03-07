import { EntityRelationalHelper } from '@utils/relational-entity-helper';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { Status } from '../../../../domain/status';

@Entity({
  name: 'status',
})
export class StatusEntity extends EntityRelationalHelper implements Status {
  @PrimaryColumn()
  id: number;

  @Column()
  name?: string;
}
