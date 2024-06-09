import axios from "axios";

const translate = (mode, text, to) => {
  if (mode === "dev") {
    return "translated text";
  }
  return axios.post({
    baseURL: "https://api.cognitive.microsofttranslator.com/",
  });
};

const translateApi = { translate };
export default translateApi;
