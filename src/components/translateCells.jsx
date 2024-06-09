import styled from "styled-components";
import caret from "textarea-caret";
import { CSSTransition } from "react-transition-group";
import "../styles.css";
import { useState, useRef, useEffect } from "react";

const TranslateCellStyle = styled.div`
  position: relative;

  display: flex;
  background-color: #ffffff;
  width: 60%;
  height: 200px;

  border: 1px solid #bcbcbc;
  border-radius: 12px;

  flex-direction: row;
  justify-content: center;
  align-items: flex-start;

  padding: 20px;

  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
`;

const TranslateCellInputStyle = styled.textarea`
  display: flex;

  width: 100%;
  height: auto;

  border: none;
  outline: none;
  resize: none;

  font-family: Pretendard;
  font-weight: 300;
  font-size: 32px;
`;

const PopupStyle = styled.button`
  width: 100px;
  outline: none;
  border: none;

  filter: drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.25));
  position: absolute;
  background: #8800cc;
  border-radius: 0px 15px 15px 15px;

  font-family: Pretendard;
  font-size: 16px;
  font-style: italic;
  font-weight: 800;

  display: flex;
  align-items: center;
  text-align: center;

  color: #ffffff;

  position: absolute;
  padding: 10px;
`;

const SelectPopupStyle = styled.div`
  position: absolute;
  width: 100px;
  height: 180px;

  background: #ffffff;
  border: 2px solid #8800cc;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.25);
  border-radius: 0px 15px 15px 15px;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 10px;
`;

const LangButtonStyle = styled.button`
  width: 100%;
  outline: none;
  border: none;
  margin: 2px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;

  text-align: center;

  color: #000000;

  background: none;
`;

const Popup = ({ top, left, show }) => {
  const [showSelect, setShowSelect] = useState(false);
  const popupRef = useRef(null);

  const popupClick = (event) => {
    setShowSelect(true);
  };

  const handleClickOutside = (event) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      showSelect
    ) {
      setShowSelect(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  if (show) {
    if (showSelect) {
      return (
        <SelectPopupStyle ref={popupRef} style={{ top, left }}>
          <LangButtonStyle>Korean</LangButtonStyle>
          <LangButtonStyle>English</LangButtonStyle>
          <LangButtonStyle>Japanese</LangButtonStyle>
          <LangButtonStyle>Chinese</LangButtonStyle>
          <LangButtonStyle>Spanish</LangButtonStyle>
          <LangButtonStyle>French</LangButtonStyle>
        </SelectPopupStyle>
      );
    } else {
      return (
        <PopupStyle onClick={() => popupClick()} style={{ top, left }}>
          Translate
        </PopupStyle>
      );
    }
  } else {
    return null;
  }
};

const TranslateCell = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef(null);
  const popupTimeout = useRef(null);

  const handleInput = (event) => {
    // 사용자 입력 감지 시 팝업을 숨기고 타이머를 재설정합니다.
    setShowPopup(false);
    if (popupTimeout.current) {
      clearTimeout(popupTimeout.current);
    }
    popupTimeout.current = setTimeout(() => {
      const textarea = textareaRef.current;
      const caretPosition = caret(textarea);

      // 커서 위치를 설정합니다.
      setPopupPosition({ top: caretPosition.top, left: caretPosition.left });
      setShowPopup(true);
    }, 2000); // 2초 동안 입력이 없으면 팝업을 표시
  };

  const handleHover = (event) => {
    if (textareaRef.current.value === "") {
      return;
    }

    popupTimeout.current = setTimeout(() => {
      const textarea = textareaRef.current;
      const caretPosition = caret(textarea);

      // 커서 위치를 설정합니다.
      setPopupPosition({ top: caretPosition.top, left: caretPosition.left });
      setShowPopup(true);
    }, 2000); // 2초 동안 마우스가 올라가 있으면 팝업을 표시
  };

  useEffect(() => {
    return () => {
      if (popupTimeout.current) {
        clearTimeout(popupTimeout.current);
      }
    };
  }, []);

  return (
    <TranslateCellStyle>
      <TranslateCellInputStyle
        placeholder="번역할 문장을 입력하세요."
        ref={textareaRef}
        onInput={handleInput}
        onMouseOver={handleHover}
      />
      <CSSTransition
        in={showPopup}
        timeout={300}
        classNames={"fade"}
        unmountOnExit
      >
        <Popup
          top={popupPosition.top + 40}
          left={popupPosition.left + 20}
          show={showPopup}
        />
      </CSSTransition>
    </TranslateCellStyle>
  );
};

export default TranslateCell;
