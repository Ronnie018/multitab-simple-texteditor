import React, { useState, useEffect } from "react";
import { FaRegSave } from "react-icons/fa";

const Snippets = ({ name }) => {
  const [open, setOpen] = useState(false);
  const [snippetText, setSnippetText] = useState(`@title ""\n\n`);
  const [savedSnippets, setSavedSnippets] = useState([]);
  const [snippetName, setSnippetName] = useState(name);

  useEffect(() => {
    setSnippetName(name);
  }, [name]);

  const handleSave = () => {
    const titleRegex = /@title "(.+?)"/;
    const titleMatch = snippetText.match(titleRegex);
    const title = titleMatch ? titleMatch[1] : "Untitled";
    const content = snippetText.replace(titleRegex, "");

    setSavedSnippets([...savedSnippets, { title, content }]);
    setSnippetText(`@title ""\n\n`);
  };

  const handleDelete = (index) => {
    const updatedSnippets = [...savedSnippets];
    updatedSnippets.splice(index, 1);
    setSavedSnippets(updatedSnippets);
  };

  const handleLoad = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const loadedSnippets = JSON.parse(e.target.result);
          setSavedSnippets(loadedSnippets);
        } catch (error) {
          console.error("Error loading snippets:", error);
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0">
      {!open && (
        <button
          onClick={() => setOpen(!open)}
          className="absolute bottom-0 rounded bg-blue_dark px-4 py-2 text-white"
          style={{ left: "50%", transform: "translateX(-50%)" }}
        >
          Open
        </button>
      )}
      {open && (
        <div className="absolute bottom-0 left-0 right-0 rounded bg-dark_gray p-4 text-white">
          <button
            onClick={() => setOpen(!open)}
            className="bg-red-600 absolute right-0 top-0 m-2 rounded px-4 py-2 text-white"
          >
            Hide
          </button>{" "}
          <textarea
            value={snippetText}
            onChange={(e) => setSnippetText(e.target.value)}
            placeholder={`Enter your snippet here with @name`}
            className="bg-light_gray h-40 w-full rounded p-4 text-white"
          />
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              className="mt-2 rounded bg-blue_light px-4 py-2 text-white hover:opacity-80"
            >
              Save Snippet
            </button>
            <div
              className="mt-2 rounded bg-blue_main px-4 py-2 text-white hover:opacity-80"
              onClick={() => {
                const blob = new Blob([JSON.stringify(savedSnippets)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "snippets.json";
                link.click();
                // tabs on localstorage
                localStorage.setItem("snippets", JSON.stringify(savedSnippets)); // not in use yet but saved
              }}
            >
              <FaRegSave size={20} color="white" />
            </div>

            <input
              type="file"
              accept=".json"
              onChange={handleLoad}
              style={{ display: "none" }}
              className="mt-2 text-white"
            />
            <button
              onClick={() => {
                const fileInput = document.querySelector('input[type="file"]');
                fileInput.click();
              }}
              className="mt-2 rounded bg-blue_main px-4 py-2 text-white hover:opacity-80"
            >
              Load Snippets
            </button>
          </div>
          {savedSnippets.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Saved Snippets:</h3>
              <ul className="flex flex-wrap gap-1 pl-0">
                {savedSnippets.map((snippet, index) => {
                  const replacedSnippet = snippet.content.replace(
                    "@name",
                    snippetName
                  );

                  return (
                    <li
                      key={index}
                      className="mt-2 cursor-pointer rounded bg-light_focus p-2"
                      onClick={() => {
                        navigator.clipboard.writeText(replacedSnippet);
                      }}
                    >
                      <span className="font-bold">{snippet.title}</span>
                      <button
                        onClick={() => handleDelete(index)}
                        className="ml-2 text-[#ff0000]"
                      >
                        X
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Snippets;
