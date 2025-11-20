import { Configuration, LogLevel, PublicClientApplication } from "@azure/msal-browser";
import { isDevelopment } from "src/core/utils/func";
const clientId = import.meta.env.REACT_APP_AZURE_CLIENT_ID ?? '';
const authority = `https://login.microsoftonline.com/${import.meta.env.REACT_APP_AZURE_TENANT_ID}`;
const redirectUri = `${window.location.origin}/login`;

const MSAL_CONFIG: Configuration = {
	auth: {
		clientId,
		authority,
		redirectUri,
	},
	cache: {
		cacheLocation: "sessionStorage",
		storeAuthStateInCookie: false,
	},
	system: {
		loggerOptions: {
			loggerCallback: (level, message, containsPii) => {
				if (containsPii || !isDevelopment()) return
				switch (level) {
					case LogLevel.Error:
						console.error(message);
						return;
					case LogLevel.Info:
						// console.info(message);
						return;
					case LogLevel.Verbose:
						// console.debug(message);
						return;
					case LogLevel.Warning:
						console.warn(message);
						return;
				}
			},
		},
	},
};

export const msalInstance = new PublicClientApplication(MSAL_CONFIG);
