import AddCellIcon from "../assets/addCell.svg";
import React from "react";
import styled from "styled-components";

const AddCellsStyle = styled.div`
  display: flex;
  width: 100%;
  height: 100px;

  justify-content: center;
  align-items: center;
`;

const AddCells = ({ ds }) => {
  return (
    <div>
      <AddCellsStyle>
        <img
          src={AddCellIcon}
          alt="Add Cell"
          width={60}
          height={60}
          onClick={ds.addCell}
          style={{
            cursor: "pointer",
            display: `${ds.cells.length >= 10 ? "none" : "block"}`,
          }}
        />
      </AddCellsStyle>
    </div>
  );
};

export default AddCells;
