import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Loading from "../components/Loading";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(0);
  const finishedRef = useRef(false);

  const finishLoading = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    document.body.style.overflowY = "auto";
    setIsLoading(false);
  };

  const value = {
    isLoading,
    setIsLoading,
    setLoading,
  };

  // Mobile / tablet: 3D character is not mounted, so simulate load progress
  useEffect(() => {
    if (window.innerWidth > 1024) return;

    let percent = 0;
    const interval = setInterval(() => {
      percent = Math.min(100, percent + 8);
      setLoading(percent);
      if (percent >= 100) clearInterval(interval);
    }, 90);

    return () => clearInterval(interval);
  }, []);

  // Failsafe: never stay stuck on loader (slow 3D, network, etc.)
  useEffect(() => {
    const failsafe = setTimeout(() => {
      setLoading(100);
    }, 16000);

    return () => clearTimeout(failsafe);
  }, []);

  useEffect(() => {
    if (loading >= 100 && isLoading) {
      const unlock = setTimeout(() => finishLoading(), 1200);
      return () => clearTimeout(unlock);
    }
  }, [loading, isLoading]);

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} onFinish={finishLoading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
