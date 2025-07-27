import React, { useState } from "react";

const wordList = ["hello", "help", "hero", "here", "hi", "how", "house", "happy"];
const usageHistory = {}; // Store word usage frequency

// Initialize usage history for all words
wordList.forEach(word => {
    usageHistory[word] = 0;
});

const WordPredictor = () => {
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleChange = (event) => {
        const value = event.target.value.toLowerCase();
        setInput(value);

        // Find matching words and sort by usage history
        const matches = wordList.filter(word => word.startsWith(value));
        matches.sort((a, b) => usageHistory[b] - usageHistory[a]);

        setSuggestions(matches);
    };

    const handleSelect = (word) => {
        setInput(word);
        setSuggestions([]);
        usageHistory[word]++; // Increase usage count
    };

    return (
        <div>
            <input
                type="text"
                value={input}
                onChange={handleChange}
                placeholder="Start typing..."
            />
            <div>
                {suggestions.map((word, index) => (
                    <div key={index} onClick={() => handleSelect(word)}>
                        {word}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WordPredictor;