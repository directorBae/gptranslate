import styled from "styled-components";
import caret from "textarea-caret";
import { CSSTransition } from "react-transition-group";
import { useSpring, animated } from "@react-spring/web";
import "../styles.css";
import { useState, useRef, useEffect, useCallback } from "react";

const TranslateCellStyle = styled(animated.div)`
  position: relative;

  display: flex;
  background-color: #ffffff;
  width: 60%;
  height: 120px;

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
  height: 100px;

  border: none;
  outline: none;
  resize: none;

  font-family: Pretendard;
  font-weight: 300;
  font-size: ${(props) => (props.fontSize ? props.fontSize + "px" : "32px")};
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

const Popup = ({ top, left, show, setIsTranslated, setShowPopup }) => {
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
    } else if (popupRef.current && !popupRef.current.contains(event.target)) {
      console.log("click outside");
      setShowPopup(false);
    }
  };

  const handleLangSelect = useCallback(
    (lang) => () => {
      console.log(lang);
      setShowSelect(false);
      setShowPopup(false);

      setIsTranslated(true);
    },
    [setIsTranslated, setShowPopup]
  );

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
          <LangButtonStyle onClick={handleLangSelect("Korean")}>
            Korean
          </LangButtonStyle>
          <LangButtonStyle onClick={handleLangSelect("English")}>
            English
          </LangButtonStyle>
          <LangButtonStyle onClick={handleLangSelect("Japanese")}>
            Japanese
          </LangButtonStyle>
          <LangButtonStyle onClick={handleLangSelect("Chinese")}>
            Chinese
          </LangButtonStyle>
          <LangButtonStyle onClick={handleLangSelect("Spanish")}>
            Spanish
          </LangButtonStyle>
          <LangButtonStyle onClick={handleLangSelect("French")}>
            French
          </LangButtonStyle>
        </SelectPopupStyle>
      );
    } else {
      return (
        <PopupStyle
          ref={popupRef}
          onClick={() => popupClick()}
          style={{ top, left }}
        >
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

  const [fontSize, setFontSize] = useState(32);

  const textareaRef = useRef(null);
  const popupTimeout = useRef(null);
  const hiddenTextareaRef = useRef(null);

  const [isTranslated, setIsTranslated] = useState(false);

  const animationProps = useSpring({
    height: isTranslated ? "240px" : "120px",
    config: { tension: 170, friction: 26 },
  });

  const getProperFontSize = (text) => {
    const hiddenTextarea = hiddenTextareaRef.current;
    hiddenTextarea.value = text;

    let testFontSize = 32;
    hiddenTextarea.style.fontSize = testFontSize + "px";

    for (let i = 0; i < 4; i++) {
      if (hiddenTextarea.scrollHeight > hiddenTextarea.clientHeight) {
        testFontSize -= 4;
        hiddenTextarea.style.fontSize = testFontSize + "px";
      } else {
        break;
      }
    }

    return testFontSize;
  };

  const handleInput = (event) => {
    // 사용자 입력 감지 시 팝업을 숨기고 타이머를 재설정합니다.
    setShowPopup(false);
    if (popupTimeout.current) {
      clearTimeout(popupTimeout.current);
    }
    popupTimeout.current = setTimeout(() => {
      const textarea = textareaRef.current;
      const caretPosition = caret(textarea);

      if (textareaRef.current.value === "") {
        return;
      }

      // 커서 위치를 설정합니다.
      if (textarea.scrollHeight > textarea.clientHeight) {
        setPopupPosition({
          top: textarea.offsetHeight,
          left: caretPosition.left,
        });
      } else {
        setPopupPosition({ top: caretPosition.top, left: caretPosition.left });
      }
      setShowPopup(true);
    }, 2000); // 2초 동안 입력이 없으면 팝업을 표시

    const properFontSize = getProperFontSize(event.target.value);
    setFontSize(properFontSize);
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
    }, 1000); // 1초 동안 마우스가 올라가 있으면 팝업을 표시
  };

  useEffect(() => {
    return () => {
      if (popupTimeout.current) {
        clearTimeout(popupTimeout.current);
      }
    };
  });

  return (
    <TranslateCellStyle style={animationProps}>
      <TranslateCellInputStyle
        fontSize={fontSize}
        placeholder="번역할 문장을 입력하세요."
        ref={textareaRef}
        onInput={handleInput}
        onMouseOver={handleHover}
      />
      <TranslateCellInputStyle
        ref={hiddenTextareaRef}
        style={{ visibility: "hidden", position: "absolute" }}
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
          setIsTranslated={setIsTranslated}
          setShowPopup={setShowPopup}
        />
      </CSSTransition>
    </TranslateCellStyle>
  );
};

export default TranslateCell;
