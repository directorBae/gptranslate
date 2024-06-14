import { makeAutoObservable, action } from "mobx";

class CellDataStore {
  cells = [{ id: Date.now(), before: "", after: null, locked: false }];

  constructor() {
    makeAutoObservable(this, {
      addCell: action,
      lockCell: action,
      unlockCell: action,
      deleteCell: action,
      changeBefore: action,
      changeAfter: action,
      resetCells: action,
    });
  }

  addCell = () => {
    this.cells.push({ id: Date.now(), before: "", after: null, locked: false });
  };

  lockCell = (index) => {
    this.cells[index].locked = true;
  };

  unlockCell = (index) => {
    this.cells[index].locked = false;
  };

  deleteCell = (index) => {
    if (this.cells.length === 1) return;
    this.cells.splice(index, 1);
  };

  changeBefore = (index, value) => {
    this.cells[index].before = value;
  };

  changeAfter = (index, value) => {
    this.cells[index].after = value;
  };

  resetCells = () => {
    this.cells = [{ id: Date.now(), before: "", after: null, locked: false }];
  };
}

const cellDataStore = new CellDataStore();
export default cellDataStore;
