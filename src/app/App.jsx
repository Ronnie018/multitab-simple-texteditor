import classNames from 'classnames';
import { useState } from "react";
import Snippets from './Snippets';

export default function App(props) {
  
  const [tabs, setTabs] = useState([
    { id: 0, text: "a", name: "tab1" },
    { id: 1, text: "d", name: "tab2" },
    { id: 2, text: "b", name: "tab3" },
    { id: 3, text: "c", name: "tab4" },
  ]);

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

  const handleNameBlur = () => {
    const updatedTabs = [...tabs];
    updatedTabs[currentTab].name = editedName;
    setTabs(updatedTabs);
    setIsEditing(false);
  };

  return (
    <div className="App flex min-h-full flex-col bg-white_ish">
      <div className="tab-bar flex gap-2 bg-black p-2">
        {tabs.map(({ id, name }) => (
          <div
            key={id}
            className="grid h-10 min-w-10 px-1 cursor-pointer place-items-center rounded-md bg-blue_main hover:bg-blue_dark"
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
      </div>
      <div className="h-full flex-1 bg-dark_gray p-2 relative">
        <textarea
          className="min-h-[calc(100vh-5rem)] w-full rounded-md p-2 resize-none"
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
