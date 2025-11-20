export type TPagination<T> = {
	items: T[];
	page: number;
	itemCount: number;
	itemsPerPage: number;
	pageCount: number;
};
