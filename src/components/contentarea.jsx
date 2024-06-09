import styled from "styled-components";

const ContentAreaStyle = styled.div`
  display: flex;
  background-color: #fafafa;
  width: 100vw;
  height: 100vh;
  align-items: top;
  padding-top: 50px;
  padding-bottom: 50px;
  padding-left: 20%;
  padding-right: 20%;
`;

const ContentArea = ({ children }) => {
  return <ContentAreaStyle>{children}</ContentAreaStyle>;
};

export default ContentArea;
