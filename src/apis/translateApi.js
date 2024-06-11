import axios from "axios";

const translate = async (mode, text, to) => {
  if (mode === "dev") {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Translated ${text} to ${to}`);
      }, 2000);
    });
  }
  return await axios.post({
    baseURL: "https://api.cognitive.microsofttranslator.com/",
  });
};

const translateApi = { translate };
export default translateApi;
