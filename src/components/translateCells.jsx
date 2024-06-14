import styled, { keyframes } from "styled-components";
import caret from "textarea-caret";
import { CSSTransition } from "react-transition-group";
import { useSpring, animated } from "@react-spring/web";
import "../styles.css";
import { useState, useRef, useEffect, useCallback } from "react";
import translateApi from "../apis/translateApi";
import { getCookie } from "../model/cookies";
import LockCellIcon from "../assets/lockCell.svg";
import UnlockCellIcon from "../assets/unlockCell.svg";
import DeleteCellIcon from "../assets/deleteCell.svg";
import { observer } from "mobx-react";

const TranslateCellStyle = styled(animated.div)`
  position: relative;

  display: flex;
  background-color: #ffffff;
  width: 100%;
  height: 120px;

  border: 1px solid #bcbcbc;
  border-radius: 12px;

  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  padding: 20px;
  margin-bottom: 60px;

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

const TranslateCellOutputStyle = styled.div`
  display: ${(props) => (props.$show ? "flex" : "none")};

  width: 100%;
  height: 100px;
  overflow-y: auto;

  border: none;
  outline: none;

  font-family: Pretendard;
  font-weight: 300;
  font-size: ${(props) => (props.fontSize ? props.fontSize + "px" : "32px")};
`;

const DividerStyle = styled.div`
  width: 100%;
  display: ${(props) => (props.$show ? "flex" : "none")};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 40px 0px;
`;

const DividerLine = styled.div`
  width: 40%;
  height: 0px;

  border: 1px solid #dadada;
`;

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const CircularLoader = styled.div`
  border: 3px solid #8800cc50;
  border-top: 3px solid #8800cc;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: ${spinAnimation} 2s linear infinite;
`;

const CompletedStyle = styled.div`
  height: 30px;
  font-family: "Pretendard";
  font-style: italic;
  font-weight: 800;
  font-size: 16px;
  display: flex;
  align-items: center;
  text-align: center;

  color: #8800cc;
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
  z-index: 100;
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

const CellManageIconContainer = styled.div`
  width: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  height: 120px;
`;

const getProperFontSize = (text, reference) => {
  const hiddenTextarea = reference.current;
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

const SelectiveLoader = ({ state }) => {
  if (state) {
    return <CompletedStyle>{"Completed!"}</CompletedStyle>;
  } else {
    return <CircularLoader />;
  }
};

const Popup = ({
  index,
  top,
  left,
  show,
  source,
  hiddenOutputRef,
  setIsTranslated,
  setShowPopup,
  setTranslatedText,
  setIsTranslateCompleted,
  setOutputFontSize,
}) => {
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
      setShowPopup(false);
    }
  };

  const handleLangSelect = useCallback(
    (lang) => async () => {
      setShowSelect(false);
      setShowPopup(false);

      const api_key = getCookie("api_key");

      if (api_key === undefined || api_key === "") {
        alert("api key is not set");
        return null;
      } else {
        setIsTranslated(true);
        setIsTranslateCompleted(false);
        const translatedText = await translateApi(api_key, source, lang);

        if (translatedText !== "" || translatedText !== null) {
          setTranslatedText(index, translatedText);
          const fontSize = getProperFontSize(translatedText, hiddenOutputRef);
          setOutputFontSize(fontSize);
          setIsTranslateCompleted(true);
        }
      }
    },
    [
      index,
      setIsTranslated,
      setShowPopup,
      setTranslatedText,
      source,
      setIsTranslateCompleted,
      hiddenOutputRef,
      setOutputFontSize,
    ]
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

const TranslateCell = observer(
  ({ index, cell, setBefore, setAfter, deleteCell, lockCell, unlockCell }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

    const [fontSize, setFontSize] = useState(32);
    const [outputFontSize, setOutputFontSize] = useState(32);

    const textareaRef = useRef(null);
    const popupTimeout = useRef(null);
    const hiddenTextareaRef = useRef(null);
    const hiddenOutputRef = useRef(null);

    const [isTranslated, setIsTranslated] = useState(false);

    const [isTranslateCompleted, setIsTranslateCompleted] = useState(false);

    const animationProps = useSpring({
      height: isTranslated ? "320px" : "120px",
      config: { tension: 170, friction: 26 },
    });

    const handleInput = (event) => {
      // 사용자 입력 감지 시 팝업을 숨기고 타이머를 재설정합니다.

      setShowPopup(false);
      setBefore(index, textareaRef.current.value);

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
          setPopupPosition({
            top: caretPosition.top,
            left: caretPosition.left,
          });
        }
        setShowPopup(true);
      }, 1000); // 2초 동안 입력이 없으면 팝업을 표시

      const properFontSize = getProperFontSize(
        event.target.value,
        hiddenTextareaRef
      );
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
        if (textarea.scrollHeight > textarea.clientHeight) {
          setPopupPosition({
            top: textarea.offsetHeight,
            left: caretPosition.left,
          });
        } else {
          setPopupPosition({
            top: caretPosition.top,
            left: caretPosition.left,
          });
        }
        setShowPopup(true);
      }, 1000); // 1초 동안 마우스가 올라가 있으면 팝업을 표시
    };

    useEffect(() => {
      const textarea = textareaRef.current;
      textarea.addEventListener("input", handleInput);
      textarea.addEventListener("keydown", handleInput);
      textarea.addEventListener("keyup", handleInput);

      return () => {
        if (popupTimeout.current) {
          clearTimeout(popupTimeout.current);
        }
        textarea.removeEventListener("input", handleInput);
        textarea.removeEventListener("keydown", handleInput);
        textarea.removeEventListener("keyup", handleInput);
      };
    });

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "60%",
          minWidth: "700px",
        }}
      >
        <TranslateCellStyle style={animationProps}>
          <TranslateCellInputStyle
            fontSize={fontSize}
            placeholder="번역할 문장을 입력하세요."
            ref={textareaRef}
            onInput={handleInput}
            onMouseOver={handleHover}
            maxLength={1000}
            readOnly={cell.locked}
          />
          <TranslateCellInputStyle
            ref={hiddenTextareaRef}
            style={{
              position: "absolute",
              width: "95%",
              visibility: "hidden",
            }}
            maxLength={1000}
          />
          <CSSTransition
            in={showPopup && !cell.locked}
            timeout={200}
            classNames={"fade"}
            unmountOnExit
          >
            <Popup
              index={index}
              top={popupPosition.top + 40}
              left={popupPosition.left + 20}
              show={showPopup && !cell.locked}
              source={cell.before}
              hiddenOutputRef={hiddenOutputRef}
              setIsTranslated={setIsTranslated}
              setShowPopup={setShowPopup}
              setTranslatedText={setAfter}
              setIsTranslateCompleted={setIsTranslateCompleted}
              setOutputFontSize={setOutputFontSize}
            />
          </CSSTransition>
          <DividerStyle $show={isTranslated}>
            <DividerLine />
            <SelectiveLoader state={isTranslateCompleted} />
            <DividerLine />
          </DividerStyle>
          <TranslateCellOutputStyle
            fontSize={outputFontSize}
            $show={isTranslated}
          >
            {cell.after}
          </TranslateCellOutputStyle>
          <TranslateCellInputStyle
            ref={hiddenOutputRef}
            style={{ visibility: "hidden", width: "95%", position: "absolute" }}
          />
        </TranslateCellStyle>
        <CellManageIconContainer>
          <img
            src={DeleteCellIcon}
            alt="delete"
            onClick={
              cell.locked
                ? () => {
                    return;
                  }
                : () => deleteCell(index)
            }
            style={{ cursor: "pointer" }}
          />
          <div style={{ height: "10px" }} />
          <img
            src={cell.locked ? UnlockCellIcon : LockCellIcon}
            alt="lock"
            onClick={
              cell.locked ? () => unlockCell(index) : () => lockCell(index)
            }
            style={{ cursor: "pointer" }}
          />
        </CellManageIconContainer>
      </div>
    );
  }
);

export default TranslateCell;
