import { useEffect, useState } from "react";
import "./styles/Loading.css";

type LoadingProps = {
  percent: number;
  onFinish: () => void;
};

const Loading = ({ percent, onFinish }: LoadingProps) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (percent < 100) return;

    const timer = setTimeout(async () => {
      setExiting(true);
      try {
        const module = await import("./utils/initialFX");
        module.initialFX?.();
      } catch {
        document.body.style.overflowY = "auto";
      }
      setTimeout(onFinish, 500);
    }, 400);

    return () => clearTimeout(timer);
  }, [percent, onFinish]);

  return (
    <div className={`loading-screen ${exiting ? "loading-screen-exit" : ""}`}>
      <div className="loading-center">
        <h1 className="loading-logo">SK</h1>
        <div className="loading-bar-track">
          <div
            className="loading-bar-fill"
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
        <p className="loading-status">
          Loading experience... {Math.min(percent, 100)}%
        </p>
      </div>
    </div>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * 5);
      percent = percent + rand;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + Math.round(Math.random());
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 2000);
    }
  }, 100);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear };
};
