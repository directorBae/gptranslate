import styled from "styled-components";
import { observer } from "mobx-react";

const MenuBarStyle = styled.div`
  display: flex;
  background-color: #ffffff;
  height: 70px;
  width: 100%;
  border-bottom: 1px solid #dadada;
`;

const TitleStyle = styled.div`
  display: flex;
  width: 168px;
  height: 39px;
  font-family: Pretendard;
  font-weight: 900;
  font-style: italic;
  font-size: 24px;
  color: #8800cc;

  align-items: center;

  position: relative;
  top: 16px;
  left: 45px;
`;

const ExtraButtonTextStyle = styled.button`
  display: flex;
  width: 93px;
  height: 20px;
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #242424;
  align-items: center;
  position: absolute;
  top: 25px;
  right: 80px;
  outline: none;
  border: none;
  background: none; /* 기본 버튼 배경 제거 */
  cursor: pointer; /* 포인터 커서 추가 */
`;

const MenuBar = observer(({ vm }) => {
  return (
    <MenuBarStyle>
      <TitleStyle>GPTranslate.</TitleStyle>
      <ExtraButtonTextStyle onClick={() => vm.turnOnPopup()}>
        API 키 관리
      </ExtraButtonTextStyle>
    </MenuBarStyle>
  );
});

export default MenuBar;
