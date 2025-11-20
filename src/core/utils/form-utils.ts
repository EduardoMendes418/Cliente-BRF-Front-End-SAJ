export const throttle = (func: (...args: any[]) => void, delay: number) => {
	let prev = 0;
	return (...args: any[]) => {
		const now = new Date().getTime();
		if (now - prev > delay) {
			prev = now;
			return func(...args);
		}
	};
};
