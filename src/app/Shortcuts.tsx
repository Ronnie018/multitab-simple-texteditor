// @ts-nocheck

import { useEffect, useState } from "react";

const useShortcuts = (
  currentTab,
  setTabs,
  tabText,
  textArea: { current: HTMLTextAreaElement },
  setShowEmojis,
  showEmojis,
  emojilist
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

  function findLineBounds(text, cursorPos) {
    let lineStart = cursorPos;
    let lineEnd = cursorPos;
    while (lineStart > 0 && text.charAt(lineStart - 1) !== "\n") {
      lineStart--;
    }
    while (lineEnd < text.length && text.charAt(lineEnd) !== "\n") {
      lineEnd++;
    }
    return { lineStart, lineEnd };
  }

  let ctrlPressed = false;
  let shiftPressed = false;
  let altPressed = false;

  function handleKeyDown(e) {
    if (e.ctrlKey) {
      ctrlPressed = true;
    }

    if (e.shiftKey) {
      shiftPressed = true;
    }

    if (e.altKey) {
      altPressed = true;
    }

    // COMMANDS

    if (ctrlPressed && e.key == 0) {
      e.preventDefault();
      formatInfo();
    }

    if (ctrlPressed && e.key == "]") {
      e.preventDefault();

      setShowEmojis((state) => !state);
    }

    if (ctrlPressed && shiftPressed && e.key === ":") {
      e.preventDefault();

      if (textArea.current) {
        const cursorPos = textArea.current.selectionStart;

        setTabs((tabs) => {
          const updatedTabs = [...tabs];
          const { text } = updatedTabs[currentTab];

          const { lineStart, lineEnd } = findLineBounds(text, cursorPos);

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

    if (altPressed && (e.key == "ArrowDown" || e.key == "ArrowUp")) {
      e.preventDefault();
      const cursorPos = textArea.current.selectionStart;
      try {
        setTabs((tabs) => {
          const updatedTabs = [...tabs];
          const { text } = updatedTabs[currentTab];
          const textLines = text.split("\n");

          const { lineStart, lineEnd } = findLineBounds(text, cursorPos);

          let nlCount = text.substring(0, lineEnd).split("\n").length - 1;

          if (e.key == "ArrowUp" && nlCount > 0) {
            let nl = textLines[nlCount];
            textLines[nlCount] = textLines[nlCount - 1];
            textLines[nlCount - 1] = nl;

            // Atualizar o texto no array de tabs
            updatedTabs[currentTab].text = textLines.join("\n");

            // Restaurar a posição do cursor após a atualização do estado
            setTimeout(() => {
              const newCursorPos = cursorPos - textLines[nlCount].length - 1;
              textArea.current.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);
          }

          if (e.key == "ArrowDown" && nlCount < textLines.length - 1) {
            let nl = textLines[nlCount];
            textLines[nlCount] = textLines[nlCount + 1];
            textLines[nlCount + 1] = nl;

            // Atualizar o texto no array de tabs
            updatedTabs[currentTab].text = textLines.join("\n");

            // Restaurar a posição do cursor após a atualização do estado
            setTimeout(() => {
              const newCursorPos = cursorPos + textLines[nlCount].length + 1;
              textArea.current.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);
          }

          return updatedTabs;
        });
      } catch (e) {
        console.log("unable to change lines");
      }
    }

    if (ctrlPressed && e.key == "z") {
      setTabs((tabs) => {
        const updatedTabs = [...tabs];
        updatedTabs[currentTab].text = cache;
        return updatedTabs;
      });
    }
  }

  function handleKeyUp(e) {
    if (e.ctrlKey) {
      ctrlPressed = false;
    }

    if (e.shiftKey) {
      shiftPressed = false;
    }

    if (e.altKey) {
      altPressed = false;
    }
  }

  useEffect(() => {
    const keydown = document.addEventListener("keydown", handleKeyDown);

    const keyUp = document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [currentTab]);

  function handleKeyDownEmojis(e) {
    if (showEmojis && "0123456789".includes(e.key)) {
      e.preventDefault();
      const cursorPos = textArea.current.selectionStart;
      const emoji = emojilist[e.key];

      setTabs((tabs) => {
        const updatedTabs = [...tabs];
        const { text } = updatedTabs[currentTab];

        updatedTabs[currentTab].text =
          text.substring(0, cursorPos) + emoji + text.substring(cursorPos);

        return updatedTabs;
      });
      setTimeout(() => {
        if (textArea.current) {
          textArea.current.setSelectionRange(cursorPos + 1, cursorPos + 1);
        }
      }, 0);
    }
  }

  useEffect(() => {
    const keydown = document.addEventListener("keydown", handleKeyDownEmojis);
  }, [showEmojis]);

  return () => {
    document.removeEventListener("keydown", handleKeyDownEmojis);
  };
};

export default useShortcuts;
