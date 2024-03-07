import { DeepPartial } from '@utils/types/deep-partial.type';
import { EntityCondition } from '@utils/types/entity-condition.type';
import { NullableType } from '@utils/types/nullable.type';
import { IPaginationOptions } from '@utils/types/pagination-options';

import { User } from '../../domain/user';
import { FilterUserDto, SortUserDto } from '../../dto/query-user.dto';

export abstract class UserRepository {
  abstract create(
    data: Omit<User, 'createdAt' | 'deletedAt' | 'id' | 'updatedAt'>,
  ): Promise<User>;

  abstract findManyWithPagination({
    filterOptions,
    paginationOptions,
    sortOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    paginationOptions: IPaginationOptions;
    sortOptions?: null | SortUserDto[];
  }): Promise<User[]>;

  abstract findOne(fields: EntityCondition<User>): Promise<NullableType<User>>;

  abstract softDelete(id: User['id']): Promise<void>;

  abstract update(
    id: User['id'],
    payload: DeepPartial<User>,
  ): Promise<null | User>;
}
