import styled from "styled-components";

export const ButtonContainer = styled.button`
    background-color: aliceblue;
    color: black;
    cursor: pointer;
    border-radius: 5px;
    &:hover{
        color: aliceblue;
        background-color: black;
    }
    &.small{
        width: 100px;
    }
    &.medium{
        width: 200px;
    }
    &.bigboi{
        width: 500px;
    }
`