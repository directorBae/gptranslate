import styled from "styled-components";

const ContentAreaStyle = styled.div`
  display: flex;
  background-color: #fafafa;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const ContentArea = ({ children }) => {
  return <ContentAreaStyle>{children}</ContentAreaStyle>;
};

export default ContentArea;
