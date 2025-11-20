import React, { Component } from 'react';

import { withStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';

import LinkWithRouter from 'src/components/LinkWithRouter';
import { t } from 'src/locale/i18n';

export interface CategoryEntry {
	title: string;
	pages: PageEntry[];
}
export interface PageEntry {
	title: string;
	url?: string;
}

const removeAccents = (s: string): string =>
	s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const getPageUrl = (page: PageEntry): string => {
	if (page.url) {
		return page.url.toLowerCase();
	}

	const url = removeAccents(page.title).toLowerCase();
	return url.replace(/[^a-z0-9]+/g, '-');
};

interface ConfigHomeProps {
	classes: any;
	categories: CategoryEntry[];
}

interface ConfigHomeState {
	filter: string;
	filterWords: string[] | null;
	filterRe: RegExp | null;
}

class ConfiguracoesHome extends Component<ConfigHomeProps, ConfigHomeState> {
	constructor(props: ConfigHomeProps) {
		super(props);

		this.state = {
			filter: '',
			filterWords: null,
			filterRe: null,
		};

		this.onChangeFilter = this.onChangeFilter.bind(this);
	}

	/// Realiza o parse do filtro e muda o state
	onChangeFilter(e: React.ChangeEvent<any>) {
		const filter = e.target.value;
		const filterTrimmed = removeAccents(filter).toLowerCase().trim();
		const filterWords =
			filterTrimmed === '' ? null : filterTrimmed.split(/\s+/g);

		let filterRe: RegExp | null = null;
		if (filterWords) {
			filterRe = new RegExp(`(${filterWords.join('|')})`, 'gi');
		}

		this.setState({ filter, filterWords, filterRe });
	}

	testIfMatch(text: string): [boolean, boolean, JSX.Element | null] {
		const { filterWords, filterRe } = this.state;

		if (!filterRe || !filterWords) {
			return [false, false, null];
		} else {
			const matchedWords: { [key: string]: boolean } = {};
			const textNoAccents = removeAccents(text);

			let pos = 0;
			const result: string[] = [];

			const re = new RegExp(filterRe);
			let m: RegExpExecArray | null = null;
			while ((m = re.exec(textNoAccents)) !== null) {
				const word = m[0];
				matchedWords[word.toLowerCase()] = true;

				if (m.index > pos) result.push(text.substring(pos, m.index));
				result.push(`<b>${text.substr(m.index, word.length)}</b>`);

				pos = m.index + word.length;
			}

			result.push(text.substr(pos));

			const html = result.join('');

			let allMatched = true;
			filterWords.forEach((word) => {
				if (!matchedWords[word]) allMatched = false;
			});

			return [
				true,
				allMatched,
				<span key={1} dangerouslySetInnerHTML={{ __html: html }}></span>,
			];
		}
	}

	render() {
		const { classes } = this.props;
		const { filter } = this.state;

		const searchInSettings = t('config.pesquisarEmConfiguracoes');

		return (
			<div>
				<Container maxWidth='sm'>
					<Paper className={classes.root} elevation={1}>
						<InputBase
							className={classes.input}
							placeholder={searchInSettings}
							inputProps={{ 'aria-label': searchInSettings }}
							onChange={this.onChangeFilter}
							value={filter}
							autoFocus
						/>
						<IconButton
							type='submit'
							className={classes.iconButton}
							aria-label='search'
							style={{ pointerEvents: 'none' }}
						>
							<SearchIcon />
						</IconButton>
					</Paper>
				</Container>

				{this.renderCategories()}
			</div>
		);
	}

	renderCategories() {
		const { categories } = this.props;

		return (
			<Box py='1rem' px='2rem'>
				{categories.map((category) => this.renderCategory(category))}
			</Box>
		);
	}

	renderCategory(category: CategoryEntry) {
		const [filtering, isCategoryMatched] = this.testIfMatch(category.title);
		const pages = this.renderPages(category.pages, isCategoryMatched);

		if (filtering && !isCategoryMatched && pages.length === 0) return null;

		return (
			<Box mb='2rem' key={category.title}>
				<Grid container>
					<Grid item xs={12}>
						<Typography variant='h2'>{category.title}</Typography>
					</Grid>

					{pages}
				</Grid>
			</Box>
		);
	}

	renderPages(pages: PageEntry[], isCategoryMatched: boolean) {
		const { classes } = this.props;

		return pages
			.map((page, pageIdx) => {
				const [filtering, matched, content] = this.testIfMatch(page.title);

				if (filtering && !matched && !isCategoryMatched) return null;

				return (
					<Grid
						item
						key={`p${pageIdx}`}
						xs={12}
						md={6}
						lg={3}
						className={classes.item}
					>
						<LinkWithRouter
							to={`/configuracoes/${getPageUrl(page)}`}
							className={classes.itemLink}
						>
							{content || page.title}
						</LinkWithRouter>
					</Grid>
				);
			})
			.filter((el) => !!el);
	}
}

const styles = (theme: Theme) => ({
	root: {
		margin: '1.5rem 4rem',
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: 400,
		overflow: 'hidden',
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1,
		padding: '4px 0',
	},
	iconButton: {
		padding: '10px 18px',
		background: '#2c3890',
		color: '#fff',
		borderRadius: 0,
		margin: '-5px -5px -5px 0',
	},
	divider: {
		height: 28,
		margin: 4,
	},

	item: {
		marginTop: '.5rem',
	},
	itemLink: {
		color: '#000',
	},
});

export default withStyles(styles)(ConfiguracoesHome);
