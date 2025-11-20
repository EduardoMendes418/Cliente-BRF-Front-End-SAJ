// Essa validação foi implementada com o intuito de aprimorar a performance da validação do Formik, especialmente em relação a formulários de grande porte.

export const makeValidation = (validateFunction: (value: any) => boolean, type: string) => ({ validateFunction, type })

export function translateErrors(errors: string[], t: any, namespace: string) {
	return errors?.map(error => {
		// Divida a string de erro em partes separadas por '.'
		const parts = error.split('.');

		// O tipo de erro é sempre a última parte
		const typeParts = parts.pop()!.split('-');
		const type = typeParts[0];

		// O campo é a segunda última parte
		const fieldKey = parts.pop()!;

		// O restante das partes constitui o caminho para o campo
		const path = parts.join('.');

		const field = t(`${namespace}:${fieldKey}`);
		let errorType = t(`${namespace}:errorTypes.${type}`);

		// Caso especial para erros do tipo 'size' e 'arrayRange', onde precisamos substituir o placeholder {sizes} ou {min}-{max}
		if (type === 'size') {
			const sizes = typeParts.slice(1).join(', ');
			errorType = errorType.replace('{sizes}', sizes);
		}

		if (type === 'stringRange' || type === 'arrayRange') {
			const [min, max] = typeParts.slice(1);
			errorType = errorType.replace('{min}', min).replace('{max}', max);
		}

		// Se a mensagem de erro não for traduzida, registre as informações pertinentes para depuração
		if (errorType.includes('validation.errorTypes')) {
			console.error(`Não foi possível traduzir o erro. namespace: ${namespace}, type: ${type}, fieldKey: ${fieldKey}, errorType: ${errorType}`);
		}

		// Retorne a mensagem de erro traduzida, incluindo o caminho para o campo, se houver
		return path ? `${path} -> "${field}" ${errorType}` : `"${field}" ${errorType}`;
	});
}
// Requerido
export const required = makeValidation(value => value, 'required');
// Tamanho específico
export const size = (sizes: number[]) => makeValidation((value: string) => sizes.includes(value.length), `size-${sizes.join('-')}`);

// // Validador para intervalo de tamanho de string
export const stringRange = (min: number, max: number) => makeValidation((value: string) => value.length >= min && value.length <= max, `stringRange${min}-${max}`);

// Validador para intervalo de tamanho de vetor
export const arrayRange = (min: number, max: number) => makeValidation((value: any[]) => value.length >= min && value.length <= max, `arrayRange-${min}-${max}`);


