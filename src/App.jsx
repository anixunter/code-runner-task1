import { useState } from "react";
import './App.css'
import useWebSocket from "./useWebSocket";

const CodeRunner = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [input, setInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const { output, sendCode } = useWebSocket(
    "wss://compiler.skillshikshya.com/ws/compiler/"
  );

  const handleRunCode = () => {
    if (!code.trim()) {
      alert("Please enter some code to run.");
      return;
    }
    setIsRunning(true);

    const payload = {
      command: "run",
      code,
      language,
    };
    sendCode(payload);
  };

  const handleStopCode = () => {
    if (!isRunning) {
      alert("No code is currently running.");
      return;
    }

    const payload = {
      command: "stop",
    };

    sendCode(payload);
    setIsRunning(false);
  };

  const handleSendInput = () => {
    if (!isRunning) {
      alert("No code is currently running.");
      return;
    }

    if (!input.trim()) {
      alert("Please provide input for the running program.");
      return;
    }

    const payload = {
      command: "input",
      input: input + "\n",
    };

    sendCode(payload);
    setInput("");
  };

  return (
    <div className="main">
      <h1>Code Runner</h1>
      <div>
        <label htmlFor="language">Language:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
      </div>

      <div>
        <label htmlFor="code">Code:</label>
        <textarea
          id="code"
          rows="10"
          cols="30"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        ></textarea>
      </div>

      <div>
        <label htmlFor="input">Input:</label>
        <input
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></input>
      </div>

      <div>
        <button onClick={handleRunCode} disabled={isRunning}>
          Run Code
        </button>
        <button onClick={handleStopCode} disabled={!isRunning}>
          Stop Code
        </button>
        <button onClick={handleSendInput} disabled={!isRunning}>
          Send Input
        </button>
      </div>

      <div>
        <h2>Output:</h2>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodeRunner;
