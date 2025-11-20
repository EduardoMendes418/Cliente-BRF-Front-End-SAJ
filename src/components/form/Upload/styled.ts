import styled from 'styled-components';

export const MainDiv = styled("div")<{isIconButton: boolean | undefined}>`
${props => (props.isIconButton ? 'inline-block' : "block")};
`

export const Label = styled.label`
margin: 0;
`