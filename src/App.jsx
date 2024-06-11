import MenuBar from "./components/menubar";
import MainView from "./pages/main/MainScreen";
import PopupScreen from "./pages/manage/PopupScreen";
import VM from "./model/vm";
import { observer } from "mobx-react";

const ViewModel = new VM();

const App = observer(() => {
  return (
    <div className="App">
      <MenuBar vm={ViewModel} />
      <MainView />
      <PopupScreen vm={ViewModel} />
    </div>
  );
});

export default App;
