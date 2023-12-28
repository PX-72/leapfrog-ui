import styled, { css } from 'styled-components';

const commonButtonLikeBaseStyle = css`
    padding: 0.5rem;
    border-radius: 0.3rem;
    cursor: pointer;
`;

export const buttonLikeBaseStyle = css`
    ${commonButtonLikeBaseStyle}
    color: ${(props) => `${props.theme.button.color}`};
    background-color: ${(props) => `${props.theme.button.background}`};
    &:hover {
        color: ${(props) => `${props.theme.button.hoverColor}`};
        background-color: ${(props) => `${props.theme.button.hoverBackground}`};
    }
`;

export const buttonLikeBaseStyle_noBg = css`
    ${commonButtonLikeBaseStyle}
    color: ${(props) => `${props.theme.button.color}`};
    &:hover {
        color: ${(props) => `${props.theme.button.hoverColor}`};
        background-color: ${(props) => `${props.theme.button.hoverBackground}`};
    }
`;

export const dangerButtonLikeBaseStyle = css`
    ${commonButtonLikeBaseStyle}
    color: ${(props) => `${props.theme.button.color}`};
    background-color: ${(props) => `${props.theme.button.dangerBackground}`};
    &:hover {
        color: ${(props) => `${props.theme.button.hoverColor}`};
        background-color: ${(props) => `${props.theme.button.dangerHoverBackground}`};
    }
`;

export const mediaSmallScreenPoint = css`
    max-width: 550px;
`;

export const DefaultButton = styled.button`
    ${buttonLikeBaseStyle}
`;

export const DefaultDangerButton = styled.button`
    ${dangerButtonLikeBaseStyle}
`;

const commonSmallButtonStyle = css`
    padding: 0.1rem;
    font-size: 0.7rem;
`;

export const SmallButton = styled.button`
    ${buttonLikeBaseStyle}
    ${commonSmallButtonStyle}
`;

export const SmallButtonNoBg = styled.button`
    ${buttonLikeBaseStyle_noBg}
    ${commonSmallButtonStyle}
`;

export const DangerSmallButton = styled.button`
    ${dangerButtonLikeBaseStyle}
    ${commonSmallButtonStyle}
`;
