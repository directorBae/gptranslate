import MenuBar from "../../components/menubar";
import ContentArea from "../../components/contentarea";
import TranslateCell from "../../components/translateCells";

function MainView() {
  return (
    <div>
      <MenuBar />
      <ContentArea>
        <TranslateCell />
      </ContentArea>
    </div>
  );
}

export default MainView;
