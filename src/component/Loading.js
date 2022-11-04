import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`
const StyledLoadingRing = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid rgba(255, 255, 255, 9);
    border-color: rgba(255, 255, 255, .9) transparent transparent transparent;
    border-radius: 50%;
    animation: ${rotate} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    &:nth-child(1) {
      animation-delay: -0.45s;
    }
    &:nth-child(2) {
      animation-delay: -0.3s;
    }
    &:nth-child(3) {
      animation-delay: -0.15s;
    }
  }
`

function Loading() {
  return (
    <StyledLoadingRing className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </StyledLoadingRing>
  )
};

export default Loading;
