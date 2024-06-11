import { makeAutoObservable } from "mobx";

class VM {
  isPopupVisible = false;
  constructor() {
    makeAutoObservable(this);
  }

  turnOnPopup = () => {
    this.isPopupVisible = true;
  };

  turnOffPopup = () => {
    this.isPopupVisible = false;
  };
}

export default VM;
