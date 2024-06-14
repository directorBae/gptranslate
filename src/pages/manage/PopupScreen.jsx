import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import SubmitIcon from "../../assets/complete.svg";
import DeleteIcon from "../../assets/delete.svg";
import { setCookie, getCookie, removeCookie } from "../../model/cookies";
import { observer } from "mobx-react";

const PopupScreenStyle = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  width: 100%;
  height: 100%;

  background-color: #00000054;

  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const PopupBoxStyle = styled.div`
  display: flex;

  width: 30%;

  background: #ffffff;
  border: 2px solid rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 15px 9px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(20px);

  border-radius: 12px;

  flex-direction: column;

  justify-content: center;
  align-items: center;

  padding: 40px;
  z-index: 101;
`;

const HeadingStyle = styled.div`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 24px;

  display: flex;
  align-items: center;
  text-align: center;

  color: #242424;

  margin: 20px;
`;

const DescriptionStyle = styled.div`
  font-family: "Spoqa Han Sans Neo";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;

  text-align: center;

  color: #606060;

  white-space: pre-wrap;

  margin: 20px;
`;

const KeyInputStyle = styled.input`
  outline: none;

  width: 70%;

  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.35);
  box-shadow: inset 0px 0px 6px 1px rgba(0, 0, 0, 0.25);
  border-radius: 8px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;

  color: #000000;

  height: 40px;

  margin: 20px;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 80px;
`;

const PopupScreen = observer(({ vm }) => {
  const [key, setKey] = useState("");
  const [isKey, setIsKey] = useState(false);

  const popupRef = useRef(null);

  const submitKey = () => {
    setCookie("api_key", key);
    vm.turnOffPopup();
  };

  const handleInput = (e) => {
    if (e.key === "Enter") {
      submitKey();
    }
    setKey(e.target.value);
  };

  const handleClickOutside = (event) => {
    if (event === undefined) {
      return;
    }
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      vm.turnOffPopup();
    }
  };

  const checkIsKey = () => {
    const cookieNow = getCookie("api_key");
    if (cookieNow !== undefined && cookieNow !== "") {
      setIsKey(true);
      setKey(cookieNow);
    } else {
      setIsKey(false);
    }
  };

  const removeKey = () => {
    removeCookie("api_key");
    setKey("");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    checkIsKey();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  if (!vm.isPopupVisible) return null;
  else {
    return (
      <PopupScreenStyle onClick={() => handleClickOutside()}>
        <PopupBoxStyle ref={popupRef}>
          <HeadingStyle>API 키 관리</HeadingStyle>
          <DescriptionStyle>
            {isKey
              ? "새로운 OpenAI API 키를 등록해주세요.\n기존의 API 키 값은 초기화됩니다."
              : "OpenAI API 키를 등록해주셔야 GPTranslate 사용이 가능합니다.\nOpenAI API 키를 등록해주세요."}
          </DescriptionStyle>
          <KeyInputStyle onChange={handleInput} value={key} />
          <IconContainer>
            <img
              src={SubmitIcon}
              alt="submit"
              onClick={() => submitKey()}
              style={{ cursor: "pointer" }}
            />
            <img
              src={DeleteIcon}
              alt="delete"
              onClick={() => removeKey()}
              style={{ cursor: "pointer" }}
            />
          </IconContainer>
        </PopupBoxStyle>
      </PopupScreenStyle>
    );
  }
});

export default PopupScreen;
