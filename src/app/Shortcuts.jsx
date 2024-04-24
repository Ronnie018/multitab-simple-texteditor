import { useEffect, useState } from "react";

const useShortcuts = (currentTab, setTabs, tabText) => {
  const [cache, setCache] = useState(tabText);

  function formatInfo() {
    setTabs((tabs) => {
      const updatedTabs = [...tabs];
      const { text } = updatedTabs[currentTab];

      setCache(() => text);

      try {
        updatedTabs[currentTab].text = mergeElements(text);
      }
      catch (e) {
        updatedTabs[currentTab].text = text;
      }
      
      return updatedTabs;
    });

    function mergeElements(text) {
      const blocks = text.split(/!merge|!end/);

      blocks[1] = blocks[1].split("\n\n");

      const groups = [
        blocks[1][0].trim().split("\n"),
        blocks[1][1].trim().split("\n"),
      ];

      const all = groups[0].map((key, i) => key + " " + groups[1][i]);

      return blocks[0] + all.join("\n") + blocks[2];
    }
  }

  useEffect(() => {
    let ctrlPressed = false;
    const ctrlDown = document.addEventListener("keydown", (e) => {
      if (e.ctrlKey) {
        ctrlPressed = true;
      }

      if (ctrlPressed && e.key == 0) {
        formatInfo();
      }

      if (ctrlPressed && e.key == "z") {
        setTabs((tabs) => {
          const updatedTabs = [...tabs];
          updatedTabs[currentTab].text = cache;
          return updatedTabs;
        });
      }
    });

    const ctrlUp = document.addEventListener("keyup", (e) => {
      if (e.ctrlKey) {
        ctrlPressed = false;
      }
    });

    return () => {
      document.removeEventListener("keydown", ctrlDown);
      document.removeEventListener("keyup", ctrlUp);
    };
  }, []);
};

export default useShortcuts;
