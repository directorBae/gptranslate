import styled from "styled-components";
import React from "react";
import TranslateCell from "./translateCells";
import AddCells from "./addCells";
import { observer } from "mobx-react";

const ContentAreaStyle = styled.div`
  display: flex;
  background-color: #fafafa;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: top;

  padding-top: 50px;
  padding-bottom: 50px;

  flex-direction: column;

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #dadada;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-track {
    background-color: #fafafa;
  }

  ::-webkit-scrollbar-button {
    display: none;
  }

  ::-webkit-scrollbar-corner {
    display: none;
  }
`;

const ContentArea = observer(({ ds }) => {
  return (
    <ContentAreaStyle>
      {ds.cells.map((cell, index) => {
        return (
          <TranslateCell
            key={cell.id}
            index={index}
            cell={cell}
            setBefore={ds.changeBefore}
            setAfter={ds.changeAfter}
            deleteCell={ds.deleteCell}
            lockCell={ds.lockCell}
            unlockCell={ds.unlockCell}
          />
        );
      })}
      <AddCells ds={ds} />
    </ContentAreaStyle>
  );
});

export default ContentArea;
