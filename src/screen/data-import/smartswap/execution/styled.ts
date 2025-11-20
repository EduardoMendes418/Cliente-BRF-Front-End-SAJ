import styled from 'styled-components';

export const ModalMainDiv = styled.div`
display: flex;
flex-direction: column;
`
export const IndexDiv = styled.div`
position: absolute;
right: 20;
top: 90;
`

export const ButtonDiv = styled.div`
display: flex;
justify-content: flex-start;
padding-bottom: 16;
padding-top: 8;
position: sticky;
top: 0;
z-index: 1;
background-color: white;
transform: translate(0px, 15px);
`

export const TableDiv = styled.div`
flex: 1;
width: 100%;
overflow-y: auto;
`