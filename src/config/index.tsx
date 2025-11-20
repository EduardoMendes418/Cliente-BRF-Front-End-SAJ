import { ReactNode, useEffect, useMemo, useState } from 'react'
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";
import { InteractionType, AccountInfo } from "@azure/msal-browser";
import IdleTimer from 'react-idle-timer'
import { pathOr } from 'ramda';

const ONE_MINUTE = 1000 * 60
const ONE_HOUR = 60 * ONE_MINUTE
const FIVE_MINUTE = 5 * ONE_MINUTE

const AuthConfig = ({ children }: { children: ReactNode }) => {
	const [interval, setInterval] = useState(0)
	const [expToken, setExpToken] = useState(0)
	const [timers, setTimers] = useState<number[]>([0, 0])
	const [isActive, setIsActive] = useState(true)

	const { instance, accounts } = useMsal();
	const account = useMemo(() => accounts[0] ?? {} as AccountInfo, [accounts])

	const requestToken = () => instance.acquireTokenSilent({ scopes: [], account })
		.then(({ expiresOn }) => setExpToken(expiresOn?.getTime() ?? 0))

	useEffect(() => {
		const in55Min = (new Date().getTime() + ONE_HOUR - FIVE_MINUTE) / 1000
		const exp = pathOr(in55Min, ['idTokenClaims', 'exp'], account)
		const newExp = exp * 1000 - new Date().getTime() - FIVE_MINUTE
		setInterval(newExp)
	}, [account])

	useEffect(() => {
		if (interval > 0 && isActive) {
			const timerTimout = window.setTimeout(() => {
				requestToken()
				const timerInterval = window.setInterval(requestToken, ONE_HOUR - FIVE_MINUTE)
				setTimers(prev => {
					window.clearInterval(prev[1])
					return [prev[0], timerInterval]
				})
			}, interval)
			setTimers(prev => {
				window.clearTimeout(prev[0])
				return [timerTimout, prev[1]]
			})
		} else if (!isActive) {
			window.clearTimeout(timers[0])
			window.clearInterval(timers[1])
			setTimers([0, 0])
		}
		
	}, [interval, isActive])

	const onActive = () => {
		const exp = expToken - new Date().getTime() - FIVE_MINUTE
		setInterval(exp > 0 ? exp : 1)
		setIsActive(true)
	}

	return (
		<MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
			<IdleTimer
				timeout={ONE_HOUR / 2}
				debounce={250}
				onActive={onActive}
				onIdle={() => setIsActive(false)}
			/>
			{children}
		</MsalAuthenticationTemplate>
	)
}

export default AuthConfig
