import { useEffect, useRef, useState } from "react";
import { IoChatbubbleEllipses, IoClose, IoSend } from "react-icons/io5";
import {
  defaultSuggestions,
  findAnswer,
  getDynamicSuggestions,
} from "../../data/interactive";
import "./styles/PortfolioAssistant.css";

type Message = { role: "user" | "bot"; text: string };

const PortfolioAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [wiggle, setWiggle] = useState(false);
  const [suggestions, setSuggestions] = useState(defaultSuggestions);
  const [userHistory, setUserHistory] = useState<string[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const el = messagesContainerRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior });
    });
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hey there! 👋 I'm Sajal's portfolio buddy. Ask me anything about his work, stack, or projects!",
    },
  ]);

  useEffect(() => {
    if (!open) return;
    scrollToBottom();
  }, [messages, typing, open, suggestions]);

  useEffect(() => {
    if (open) {
      setHintVisible(false);
      setTimeout(() => scrollToBottom("auto"), 100);
      return;
    }

    const showHint = setTimeout(() => setHintVisible(true), 2000);
    const wiggleLoop = setInterval(() => {
      setWiggle(true);
      setTimeout(() => setWiggle(false), 650);
    }, 5000);

    return () => {
      clearTimeout(showHint);
      clearInterval(wiggleLoop);
    };
  }, [open]);

  const send = (text: string) => {
    if (!text.trim() || typing) return;

    const trimmed = text.trim();
    const isGreeting = /^(hi|hello|hey|hola|namaste)\b/i.test(trimmed);
    const answer = isGreeting
      ? "Hey! 👋 Great to meet you. I'm here to tell you about Sajal — his full-stack work, projects like Pythag & Petwell, and how recruiters can reach him. What would you like to know?"
      : findAnswer(trimmed);

    const updatedHistory = [...userHistory, trimmed];

    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setUserHistory(updatedHistory);
    setInput("");
    setTyping(true);
    setTimeout(() => scrollToBottom(), 50);

    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: answer }]);
      setSuggestions(getDynamicSuggestions(trimmed, updatedHistory));
      setTyping(false);
      setTimeout(() => scrollToBottom(), 50);
    }, 700 + Math.random() * 500);
  };

  const handleOpen = () => {
    setOpen((v) => !v);
    setWiggle(false);
  };

  const handleSayHi = () => {
    if (!open) {
      setOpen(true);
      setTimeout(() => send("Hi"), 200);
    } else {
      send("Hi");
    }
  };

  return (
    <div className="assistant-widget" data-cursor="disable">
      {!open && hintVisible && (
        <button
          className="assistant-hint"
          onClick={handleSayHi}
          aria-label="Say hi to portfolio assistant"
        >
          <span className="assistant-hint-bubble">
            Say Hi! <span className="assistant-wave">👋</span>
          </span>
          <span className="assistant-hint-tail" />
        </button>
      )}

      <div className={`assistant-fab-scene ${wiggle && !open ? "assistant-wiggle" : ""}`}>
        <span className="assistant-fab-shadow" aria-hidden="true" />
        <span className="assistant-fab-ring" aria-hidden="true" />
        <button
          className={`assistant-fab ${open ? "assistant-fab-open" : ""}`}
          onClick={handleOpen}
          aria-label="Portfolio assistant"
        >
          <span className="assistant-fab-face">
            {open ? <IoClose /> : <IoChatbubbleEllipses />}
          </span>
        </button>
      </div>

      {open && (
        <div className="assistant-panel">
          <div className="assistant-header">
            <div className="assistant-header-avatar">✦</div>
            <div>
              <strong>Portfolio Assistant</strong>
              <span>Ask me anything!</span>
            </div>
            <button
              className="assistant-hi-btn"
              onClick={() => send("Hi")}
              type="button"
            >
              Say Hi 👋
            </button>
          </div>

          <div className="assistant-messages" ref={messagesContainerRef}>
            {messages.map((msg, i) => (
              <div
                key={`${msg.role}-${i}-${msg.text.slice(0, 12)}`}
                className={`assistant-msg assistant-msg-${msg.role} assistant-msg-pop`}
              >
                {msg.text}
              </div>
            ))}
            {typing && (
              <div className="assistant-typing">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>

          <div className="assistant-suggestions" key={suggestions.join("|")}>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                type="button"
                className="assistant-suggestion-btn"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            className="assistant-input"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about my work..."
            />
            <button type="submit" aria-label="Send" disabled={typing}>
              <IoSend />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PortfolioAssistant;
