export enum FLOWS {
	FLOW1 = "1",
	FLOW2 = "2"
}
export const flowOptions = [
	{ label: "Primeiro Nível", value: FLOWS.FLOW1 },
	{ label: "Segundo Nível", value: FLOWS.FLOW2 }
] as any

export const flowDictionary = {
	[FLOWS.FLOW1]: "Primeiro Nível",
	[FLOWS.FLOW2]: "Segundo Nível"
} as any
