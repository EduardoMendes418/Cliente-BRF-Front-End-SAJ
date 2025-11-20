import { TArea } from './areas';
import { TUserDefault } from './users'

export type TBusinessCombinationAccounting = {
	id?: number,
	status: number | '',
	competence: string | null,
	createdDate: string | null,
	area: TArea | null,
	requester: TUserDefault | null,
}