// @ts-nocheck

import { useEffect, useState } from "react";

const useShortcuts = (
  currentTab,
  setTabs,
  tabText,
  textArea
) => {
  const [cache, setCache] = useState(tabText);

  function formatInfo() {
    setTabs((tabs) => {
      const updatedTabs = [...tabs];
      const { text } = updatedTabs[currentTab];

      setCache(() => text);

      try {
        updatedTabs[currentTab].text = mergeElements(text);
      } catch (e) {
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
    let shiftPressed = false;
    const keydown = document.addEventListener("keydown", (e) => {
      if (e.ctrlKey) {
        ctrlPressed = true;
      }

      if (e.shiftKey) {
        shiftPressed = true;
      }

      // COMMANDS

      if (ctrlPressed && e.key == 0) {
        e.preventDefault();
        formatInfo();
      }

      if (ctrlPressed && shiftPressed && e.key === ":") {
        e.preventDefault();

        if (textArea.current) {
          const cursorPos = textArea.current.selectionStart;

          setTabs((tabs) => {
            const updatedTabs = [...tabs];
            const { text } = updatedTabs[currentTab];

            // Encontrar o início e o fim da linha atual
            let lineStart = cursorPos;
            let lineEnd = cursorPos;
            while (lineStart > 0 && text.charAt(lineStart - 1) !== "\n") {
              lineStart--;
            }
            while (lineEnd < text.length && text.charAt(lineEnd) !== "\n") {
              lineEnd++;
            }

            // Adicionar "> " ao início da linha atual
            const updatedText =
              text.substring(0, lineStart) +
              "> " +
              text.substring(lineStart, lineEnd) +
              text.substring(lineEnd);

            // Atualizar o texto no array de tabs
            updatedTabs[currentTab].text = updatedText;

            return updatedTabs;
          });

          // Restaurar a posição do cursor após a atualização do estado
          setTimeout(() => {
            if (textArea.current) {
              textArea.current.setSelectionRange(cursorPos + 2, cursorPos + 2); // Adiciona 2 para considerar "> "
            }
          }, 0); // Usamos um pequeno atraso para garantir que a atualização do estado tenha sido concluída
        }
      }

      if (ctrlPressed && e.key == "z") {
        setTabs((tabs) => {
          const updatedTabs = [...tabs];
          updatedTabs[currentTab].text = cache;
          return updatedTabs;
        });
      }
    });

    const keyUp = document.addEventListener("keyup", (e) => {
      if (e.ctrlKey) {
        ctrlPressed = false;
      }

      if (e.shiftKey) {
        shiftPressed = false;
      }
    });

    return () => {
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("keyup", keyUp);
    };
  }, [currentTab]);
};

export default useShortcuts;
