import { useEffect, useState } from "react";
import Snippets from "./Snippets";
import { FaRegSave } from "react-icons/fa";

export default function App(props) {
  const [tabs, setTabs] = useState(() => {
    const defaultTabs = JSON.stringify([
      { id: 0, text: "", name: "spam" },
      { id: 1, text: "", name: "INCS" },
    ]);

    const savedTabs = JSON.parse(localStorage.getItem("tabs") || defaultTabs);

    return savedTabs;
  });

  let done = false;
  const [currentTab, setCurrentTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  const [currentName, setCurrentName] = useState("");

  const handleTabChange = (id) => {
    setCurrentTab(id);
    setIsEditing(false); // Close editing mode when switching tabs
    setCurrentName(tabs[id].name);
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
        {tabs && tabs.map(({ id, name }) => (
          <div
            key={id}
            className="min-w-10 grid h-10 cursor-pointer place-items-center rounded-md bg-blue_main px-1 hover:bg-blue_dark"
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
          className="grid h-10 w-10 cursor-pointer place-items-center rounded-md bg-blue_main hover:bg-blue_dark"
          onClick={() => setTabs([...tabs, { id: tabs.length }])}
        >
          +
        </div>
        <div
          className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-md bg-blue_main hover:bg-blue_dark"
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
        <textarea
          className="min-h-[calc(100vh-5rem)] w-full resize-none rounded-md p-2"
          value={tabs[currentTab].text}
          onChange={(e) => {
            tabs[currentTab].text = e.target.value;
            setTabs([...tabs]);
          }}
        />
        <Snippets name={currentName} />
      </div>
    </div>
  );
}
