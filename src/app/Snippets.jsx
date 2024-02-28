import React, { useState, useEffect } from 'react';

const Snippets = ({ name }) => {
  const [open, setOpen] = useState(false);
  const [snippetText, setSnippetText] = useState('');
  const [savedSnippets, setSavedSnippets] = useState([]);
  const [snippetName, setSnippetName] = useState(name);

  useEffect(() => {
    setSnippetName(name);
  }, [name]);

  const handleSave = () => {
    const titleRegex = /@title "(.+?)"/;
    const titleMatch = snippetText.match(titleRegex);
    const title = titleMatch ? titleMatch[1] : 'Untitled';
    const content = snippetText.replace(titleRegex, '');

    setSavedSnippets([...savedSnippets, { title, content }]);
    setSnippetText('');
  };

  const handleDelete = (index) => {
    const updatedSnippets = [...savedSnippets];
    updatedSnippets.splice(index, 1);
    setSavedSnippets(updatedSnippets);
  };

  return (
    <div className="absolute left-0 right-0 bottom-0">
      {!open && (
        <button
          onClick={() => setOpen(!open)}
          className="bg-blue_dark text-white py-2 px-4 rounded absolute bottom-0"
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        >
          Open
        </button>
      )}
      {open && (
        <div className="bg-dark_gray text-white p-4 rounded absolute left-0 right-0 bottom-0">
          <button
            onClick={() => setOpen(!open)}
            className="bg-red-600 text-white py-2 px-4 rounded absolute top-0 right-0 m-2"
          >
            Hide
          </button>
          <textarea
            value={snippetText}
            onChange={(e) => setSnippetText(e.target.value)}
            placeholder={`Enter your snippet here with @name`}
            className="w-full h-40 bg-light_gray text-white p-4 rounded"
          />
          <button
            onClick={handleSave}
            className="bg-blue_light text-white py-2 px-4 rounded mt-2"
          >
            Save Snippet
          </button>
          {savedSnippets.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Saved Snippets:</h3>
              <ul className="pl-0 flex">
                {savedSnippets.map((snippet, index) => {
                  const replacedSnippet = snippet.content.replace('@name', snippetName);

                  return (
                    <li
                      key={index}
                      className="mt-2 p-2 bg-light_focus cursor-pointer rounded"
                      onClick={() => {
                        navigator.clipboard.writeText(replacedSnippet);
                      }}
                    >
                      <span className="font-bold">{snippet.title}</span>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-[#ff0000] ml-2"
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
