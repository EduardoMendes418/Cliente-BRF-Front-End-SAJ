const readFileToBase64 = (file: File) => new Promise<string>((resolve, reject) => {
	const reader = new FileReader()
	reader.readAsDataURL(file)
	reader.onload = () => resolve(reader.result as string)
	reader.onerror = error => reject(error)
})

export default async function handleFileToBase64(files: File[]) {
	const promises: Promise<string>[] = []
	let base64ResolvedPromisesFiles: string[]

	files.forEach(file => promises.push(readFileToBase64(file)))
	base64ResolvedPromisesFiles = await Promise.all(promises)
	return base64ResolvedPromisesFiles.map(base64File => base64File.replace(/^data:text\/plain;base64,/i, ''))
}
