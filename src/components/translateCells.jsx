import styled from "styled-components";

const TranslateCellStyle = styled.div`
  display: flex;
  background-color: #ffffff;
  width: 70%;

  border: 1px solid #bcbcbc;

  flex-direction: row;
  align-items: center;
`;

const TranslateCellInputStyle = styled.input`
  display: flex;
  color #adadad:
  border: none;

  width: 100%;

  font-family: Pretendard;
  font-weight: 300;
  font-size: 32px;
  
  `;

const TranslateCell = () => {
  return (
    <TranslateCellStyle>
      <TranslateCellInputStyle placeholder="번역할 문장을 입력하세요." />
    </TranslateCellStyle>
  );
};

export default TranslateCell;
