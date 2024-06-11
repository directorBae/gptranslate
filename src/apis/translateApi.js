import axios from "axios";
import { getCookie } from "../model/dataStore";

const translateApi = async (text, to) => {
  const api_key = getCookie("api_key");

  if (api_key === undefined || api_key === "") {
    alert("api key is not set");
    return;
  }

  const data = {
    api_key: api_key,
    lang: to,
    source_text: text,
  };

  try {
    const res = await axios.post(
      "https://fa2tjkwxeg.execute-api.us-east-2.amazonaws.com/default/gpt_answer",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": `http://localhost:3000`,
        },
      }
    );
    return res.data; // 응답 데이터 반환
  } catch (err) {
    console.log(err);
    return null; // 에러 발생 시 null 반환
  }
};

export default translateApi;
