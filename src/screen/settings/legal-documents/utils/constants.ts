
export enum LegalDocFormType
{
	PREPOSITION_LETTER = 1, //"Carta Preposição"
	REPLACEMENT, //"Substabelecimento"
	ELETRONIC_PROCURATION_LEGAL, //"Procuração Eletrônica - Jurídico"
	ELETRONIC_PROCURATION_OTHER_AREAS  //"Procuração Eletrônica - Demais Áreas"
}

export const legalDocFormTypeOptions = [
	{ label: "Carta Preposição", value: LegalDocFormType.PREPOSITION_LETTER },
	{ label: "Substabelecimento", value: LegalDocFormType.REPLACEMENT },
	{ label: "Procuração Eletrônica - Jurídico", value: LegalDocFormType.ELETRONIC_PROCURATION_LEGAL },
	{ label: "Procuração Eletrônica - Demais Áreas", value: LegalDocFormType.ELETRONIC_PROCURATION_OTHER_AREAS },
]

export const legalDocFormTypeDictionary = legalDocFormTypeOptions.reduce((acc, { label, value }) => {
	acc[value] = label
	return acc
}, {} as { [key in LegalDocFormType]: string })
