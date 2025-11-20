import styled from 'styled-components';

export const MainDiv = styled("div")<{ativateBorder: boolean | undefined}>`

${props => props.ativateBorder && `
border-style: solid;
border-radius: 8;
border-color: #E2E2E2;
border-width: 1;
`}
`