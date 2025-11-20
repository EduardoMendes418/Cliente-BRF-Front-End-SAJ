import { TFilterType, TReportComponent } from "./reports";

export type TReportConfiguration = {
	id?: number | string;
	filterName: string;
	isPublic: boolean | string;
	reportComponent: TReportComponent;
	reportFilterFields: TReportFilterField[];
	isActive: boolean;
	isDeleted: boolean;
};

export type TReportConfigurationFilter = {
	filterName?: string;
	reportComponent?: TReportComponent;
};

export type TReportFilterField = {
	filterType: TFilterType;
	fieldName: string;
	value: string;
};

