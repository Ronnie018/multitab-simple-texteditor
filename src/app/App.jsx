import { useRef, useState } from "react";
import Snippets from "./Snippets";
import { FaRegSave } from "react-icons/fa";
import useShortcuts from "./Shortcuts";
import classNames from "classnames";

export default function App(props) {
  const textArea = useRef(null);
  const [tabs, setTabs] = useState(() => {
    const defaultTabs = JSON.stringify([
      { id: 0, text: "", name: "spam" },
      { id: 1, text: "", name: "INCS" },
    ]);

    const savedTabs = JSON.parse(localStorage.getItem("tabs") || defaultTabs);

    return savedTabs;
  });

  const [currentTab, setCurrentTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  const [showEmojis, setShowEmojis] = useState(false);

  const emojilist = [
    "⬇️",
    "⬆️",
    "✅",
    "🔧",
    "🏆",
    "⚙️",
    "🏷️",
    "⚠️",
    "🕒",
    "📧",
  ];

  useShortcuts(
    currentTab,
    setTabs,
    tabs[currentTab].text,
    textArea,
    setShowEmojis,
    showEmojis,
    emojilist
  );

  const [currentName, setCurrentName] = useState("");

  const handleTabChange = (id) => {
    setCurrentTab(id);
    setIsEditing(false); // Close editing mode when switching tabs
    setCurrentName(tabs[id].name);
    setShowEmojis(false);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditedName(tabs[currentTab].name);
  };

  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };

  const handleNameKeyDown = (e) => {
    if (e.key === "Enter") {
      handleNameBlur();
    }
  };

  const handleNameBlur = () => {
    const updatedTabs = [...tabs];
    updatedTabs[currentTab].name = editedName;
    setTabs(updatedTabs);
    setIsEditing(false);
  };

  return (
    <div className="App flex min-h-full flex-col bg-white_ish">
      <div className="tab-bar flex gap-2 bg-black p-2">
        {tabs &&
          tabs.map(({ id, name }) => (
            <div
              key={id}
              className={classNames(
                "min-w-10 grid h-10 cursor-pointer place-items-center rounded-md px-1 hover:bg-blue_dark",
                id === currentTab ? "bg-blue_main" : "bg-dark_gray"
              )}
              onClick={() => handleTabChange(id)}
              onDoubleClick={handleDoubleClick}
              title={name} // Tooltip content
            >
              <span>{name}</span>
              {isEditing && id === currentTab && (
                <input
                  type="text"
                  value={editedName}
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  onKeyDown={handleNameKeyDown} // Handle "Enter" key
                  autoFocus
                />
              )}
            </div>
          ))}
        <div
          className="grid h-10 w-10 cursor-pointer place-items-center rounded-md bg-dark_gray hover:bg-blue_dark"
          onClick={() => setTabs([...tabs, { id: tabs.length }])}
        >
          +
        </div>
        <div
          className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-md bg-dark_gray hover:bg-blue_dark"
          onClick={() => {
            const blob = new Blob([JSON.stringify(tabs)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "tabs.json";
            link.click();
            // tabs on localstorage
            localStorage.setItem("tabs", JSON.stringify(tabs));
          }}
        >
          <FaRegSave size={20} color="white" />
        </div>
      </div>
      <div className="relative h-full flex-1 bg-dark_gray p-2">
        <div className="absolute">
          {showEmojis && (
            <div className="absolute flex w-[calc(100vw-4rem)] resize flex-wrap gap-2 bg-dark_gray p-2 opacity-80">
              {emojilist.map((emoji) => (
                <div
                  key={emoji}
                  className="cursor-pointer"
                  onClick={() => {
                    setTabs((prevTabs) => {
                      const updatedTabs = [...prevTabs];
                      const cursorPos = textArea.current.selectionStart;

                      updatedTabs[currentTab].text =
                        tabs[currentTab].text.slice(0, cursorPos) +
                        emoji +
                        tabs[currentTab].text.slice(cursorPos);
                      updatedTabs[currentTab].text =
                        updatedTabs[currentTab].text;
                      return updatedTabs;
                    });
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
          )}
        </div>
        <textarea
          id={currentTab}
          ref={textArea}
          className="min-h-[calc(100vh-5rem)] w-full resize-none rounded-md p-2"
          value={tabs[currentTab].text}
          onChange={(e) => {
            setTabs((prevTabs) => {
              const updatedTabs = [...prevTabs];
              updatedTabs[currentTab].text = e.target.value;
              return updatedTabs;
            });
          }}
        />
        <Snippets name={currentName} />
      </div>
    </div>
  );
}
