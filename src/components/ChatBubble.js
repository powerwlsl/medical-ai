import { React , useState } from "react";

export default function ChatBubble(props) {
    const {isAgent, message} = props;
    // const [isAgent, setisAgent] = useState(false)
  return (
    <li className={`flex justify-${ isAgent ? 'start' : 'end'}`}>
      <div class="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
        <span class="block">{message}</span>
      </div>
    </li>
  );
}
