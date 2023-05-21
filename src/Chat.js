import { React, useRef, useState } from "react";
import ChatBubble from "./components/ChatBubble";
import env from "react-dotenv";
const { Configuration, OpenAIApi } = require("openai");
export default function Chat(props) {
  const configuration = new Configuration({
    //apiKey: process.env.REACT_APP_OPEN_API_API_KEY,
    apiKey: "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",
  });
  const { show } = props;
  const openai = new OpenAIApi(configuration);
  const [prompt, setPrompt] = useState("hey how are you?");
  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [fullMsgString, setFullMsgString] = useState("");
  const [msgArr, setMsgArr] = useState([])
  const inputRef = useRef(null);

  const helpAI = "You are a medical expert explainer with twist. You explain to your user in a language that anyone can understand.\n\n"
  const patientRecord = "Patient's record: Received in formalin, labeled with the patient's name, date of birth, and appendix, is a 5.8 cm in length by 0.8 cm in greatest diameter appendix with a stapled proximal margin. The serosal surface is tan brown with focal areas of fibrinopurulent appearing exudate. The mesoappendix measures 1.7 cm from the wall in greatest dimension. The proximal margin is inked blue and shaved. A 0.5 x 0.4 x 0.2 cm tan-brown ovoid possible lymph node is identified. Sectioning the appendix reveals tan-brown, granular contents within the lumen. The lumen ranges from 0.3-0.5 cm in diameter. The wall thickness ranges from 0.1-0.3 cm. No discrete lesions, masses or fecaliths are identified. Representative sections are submitted in cassette A1.\n";
  const handleSubmit = async (e) => {
    inputRef.current.value = "";
    e.preventDefault();

    setLoading(true);
    try {
      let updatedMsgArr = [...msgArr, { role: "User", msg: inputMessage }]
      let fullMsgStr = updatedMsgArr.reduce((agg,{role,msg}) => agg +=`${role} : ${msg} \n`, "")
      setMsgArr(updatedMsgArr)

      const updateFullMsg = fullMsgStr +" User: " + inputMessage + "\n AI: "
      setFullMsgString(updateFullMsg)
      const fullPrompt = helpAI+ patientRecord  + updateFullMsg
      const result = await openai.createCompletion({
        model: "text-davinci-003",
        
        prompt: fullPrompt,
        temperature: 0.5,
        max_tokens: 200,
      });

      console.log("response", result.data.choices[0].text);
      updatedMsgArr = [...updatedMsgArr, { role: "AI", msg: result.data.choices[0].text.replaceAll("\n", "") }]
      setMsgArr(updatedMsgArr)
      setApiResponse(result.data.choices[0].text);
      setMsgArr(updatedMsgArr)
    } catch (e) {
      //console.log(e);
      setApiResponse("Something is going wrong, Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className={`container mx-auto rounded-lg shadow-lg chatApp  bg-white ${show ? "" : "hide"}`}>
      <div class="max-w-2xl border rounded">
        <div>
          <div class="w-full">
            <div class="relative flex items-center p-3 border-b border-gray-200">
              <img
                class="object-cover w-10 h-10 rounded-full"
                src="https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg"
                alt="username"
              />
              <span class="block ml-2 font-bold text-gray-600">Medical AI</span>
              <span class="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
            </div>
            <div class="relative w-full p-6 overflow-y-auto bg-[#f1f5f9]">
              <ul class="space-y-2">
                {
                  msgArr.map(({ role, msg }) => {
                    return <ChatBubble isAgent={role == "User"} message={msg}></ChatBubble>
                  })
                }


              </ul>
            </div>

            <div class="flex items-center justify-between w-full p-3 border-t border-gray-300">

              <input
                type="text"
                placeholder="Message"
                class="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                name="message"
                required
                ref={inputRef}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
              <button type="submit" onClick={handleSubmit}>
                <svg
                  class="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
