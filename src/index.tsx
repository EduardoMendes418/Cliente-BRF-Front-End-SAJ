import './core/styles/index.scss';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MsalProvider } from "@azure/msal-react";

import App from './App';
import AuthConfig from 'src/config'
import store from './core/store';
import theme from './core/theme';

import { msalInstance } from "src/config/auth";

ReactDOM.render(
	<MsalProvider instance={msalInstance}>
		<AuthConfig>
			<Provider store={store}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<App />
				</ThemeProvider>
			</Provider>
		</AuthConfig>
	</MsalProvider>,
	document.getElementById('root')
);
