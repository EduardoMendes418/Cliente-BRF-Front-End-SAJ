import { createTheme } from '@material-ui/core/styles';

const palette = {
	primary: {
		light: '#922F98',
		main: '#2c3890',
		dark: '#181e50',
		contrastText: '#fff',
	},
	secondary: {
		light: '#FFE183',
		main: '##e6883f ',
		dark: '#e6883f',
		contrastText: 'rgba(0, 0, 0, 0.54)',
	},
	text: {
		primary: 'rgba(0, 0, 0, 0.87)',
		secondary: 'rgba(0, 0, 0, 0.54)',
		disabled: 'rgba(0, 0, 0, 0.38)',
		label: '#000',
	},
	error: {
		main: '#CC2027',
	},
	warning: {
		main: '#EE7E22',
	},
	info: {
		main: '#055EA9',
	},
	success: {
		main: '#389243',
	},
	background: {
		paper: '#fff',
		default: '#e5e5e5',
		disabled: 'rgba(0, 0, 0, 0.38)',
	},
};

const theme = createTheme({
	palette,
	spacing: 8,
	typography: {
		h1: {
			fontSize: '64px',
			fontWeight: 400,
			lineHeight: '72px',
			fontFamily: 'CoHeadline',
		},
		h2: {
			fontSize: '20px',
			fontWeight: 'normal',
			lineHeight: '32px',
			fontFamily: 'CoHeadline',
		},
		h3: {
			fontSize: '18px',
			fontWeight: 400,
	        fontFamily: 'CoHeadline',
			lineHeight: '24px',
		},
		h4: {
			fontSize: '16px',
			fontWeight: 'normal',
			lineHeight: '24px',
			fontFamily: 'Noto Sans',
		},
		body1: {
			fontSize: '14px',
			fontFamily: 'Noto Sans',
		},
		body2: {
			fontSize: '12px',
			fontFamily: 'Roboto',
			fontWeight: 500
		},
	},
	props: {
		MuiTextField: {
			variant: 'outlined',
			fullWidth: true,
			InputLabelProps: {
				shrink: true,
			},
		},
		MuiFormControl: {
			variant: 'outlined',
			fullWidth: true,
		},
	},
	overrides: {
		MuiButton: {
			root: {
				borderRadius: '200px',
				fontFamily: 'Roboto',
				fontSize: '14px',
				fontWeight: 500,
			},
			outlinedSecondary: {
				color: '#e6883f',
				borderColor: '#e6883f',
			},
			outlined: {
				color: palette.text.secondary,
			},
		},
		MuiTableRow: {
			root: {
				'&:nth-child(even)': {
					backgroundColor: '#fbfbfb',
				},
				'&:hover': {
					backgroundColor: '#f5f4f4',
				},
			},
		},
		MuiTableCell: {
			root: {
				fontFamily: 'Noto Sans',
				padding: '8px 32px',
			},
			head: {
				fontSize: '12px',
				fontWeight: 'normal',
				lineHeight: '24px',
				fontFamily: 'Noto Sans',
				backgroundColor: '#f5f4f4',
				color: '#000',
				padding: '16px 32px',
			},
			body: {
				fontSize: '14px',
				lineHeight: '24px',
				fontFamily: 'Noto Sans',
			},
		},
		MuiLink: {
			underlineHover: {
				textDecoration: 'none',
				color: '#8D9091',
				'&:hover': {
					textDecoration: 'none',
					color: palette.primary.main,
				},
			},
		},
		// MuiPaginationItem: {
		// 	root: {
		// 		color: palette.text.secondary,
		// 		fontFamily: 'Noto Sans',
		// 	},
		// },
		MuiFormControl: {
			root: {
				marginTop: '0',
			},
		},
		MuiFormLabel: {
			root: {
				color: palette.text.label,
			},
		},
		MuiFormHelperText: {
			root: {
				fontSize: '10px',
				fontFamily: 'Noto Sans',
				color: '#333',
				height: '16px',
			},
		},
		MuiToolbar: {
			root: {
				height: '80px',
				padding: '0 8px',
			},
		},
		MuiAccordionDetails: {
			root: {
				padding: '0',
			},
		},
		MuiAccordionSummary: {
			content: {
				'& .Mui-expanded': {
					margin: 0,
				},
			},
		},
		MuiOutlinedInput: {
			input: {
				padding: '15px 14px',
			},
		},
		MuiListSubheader:{
			sticky: {
				fontSize: '16px',
			}
		},
	},
});

export default theme;
