import { Link, LinkProps } from 'react-router-dom';
import MuiLink, { LinkProps as MuiLinkProps } from '@material-ui/core/Link';

export default function LinkWithRouter(props: LinkProps & MuiLinkProps) {
	return <MuiLink component={Link} {...props} />;
}
