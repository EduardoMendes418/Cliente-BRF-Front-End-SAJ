import { useState, useMemo } from "react";

type Setters = {
	setTrue: () => void,
	setFalse: () => void,
	toggle: () => void,
}

export default function useBoolean(initialValue: boolean): [boolean, Setters] {
	const [state, setState] = useState(initialValue);

	const setters = useMemo(() => ({
		setTrue: () => setState(true),
		setFalse: () => setState(false),
		toggle: () => setState((oldState) => !oldState),
	}), [])

	return [state, setters]
}