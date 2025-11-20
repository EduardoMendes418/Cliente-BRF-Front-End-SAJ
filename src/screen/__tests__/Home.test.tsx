import { render } from '@testing-library/react';
import Home from '../Home';
import store from 'src/core/store';
import { Provider } from 'react-redux';

describe('Home Screen', () => {
	test("Exibe mensagem 'Dashboard'", () => {
		const component = render(
			<Provider store={store}>
				<Home />
			</Provider>
		);
		const message = 'Dashboard';
		expect(component.getByText(message)).toBeTruthy();
	});
});
