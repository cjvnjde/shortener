import React, { useEffect, useState } from "react";
import { useShortenUrl } from "./hooks/useShortenUrl";
import "./App.css";

const App = () => {
  const [url, setUrl] = useState("");
  const { shortenUrl, submit } = useShortenUrl();

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const { clipboardData } = e;
      const pastedText = clipboardData?.getData("text") || "";

      setUrl(pastedText);
    };

    document.body.addEventListener("paste", onPaste);

    return () => {
      document.body.removeEventListener("paste", onPaste);
    };
  }, []);

  return (
    <div className="container">
      <div className="field">
        <input
          className="field__input"
          value={url} onChange={e => setUrl(e.target.value)}
        />
        <button
          className="field__button"
          onClick={() => submit(url)}
        >
          Submit
        </button>
      </div>

      <div className="shorten-url-wrapper">
        {
          Boolean(shortenUrl) && (
            <div className="shorten-url-container">
              <a href={shortenUrl}>
                {shortenUrl}
              </a>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default App;