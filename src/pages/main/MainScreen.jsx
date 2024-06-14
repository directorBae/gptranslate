import ContentArea from "../../components/contentarea";
import cellDataStore from "../../model/dataStore";
import { observer } from "mobx-react";

const MainView = observer(() => {
  return (
    <div>
      <ContentArea ds={cellDataStore} />
    </div>
  );
});

export default MainView;
