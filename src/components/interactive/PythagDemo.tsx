import { useEffect, useState } from "react";
import "./styles/PythagDemo.css";

type Metric = {
  label: string;
  value: number;
  unit: string;
  max: number;
};

const initialMetrics: Metric[] = [
  { label: "Cell Vitality", value: 87, unit: "%", max: 100 },
  { label: "API Latency", value: 68, unit: "ms", max: 200 },
  { label: "Active Sessions", value: 1240, unit: "", max: 2000 },
  { label: "Uptime", value: 99.9, unit: "%", max: 100 },
];

const PythagDemo = () => {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [chartHeights, setChartHeights] = useState(() =>
    Array.from({ length: 24 }, () => 40 + Math.random() * 40)
  );
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(true);
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => {
          const delta = (Math.random() - 0.5) * (m.label === "API Latency" ? 12 : 4);
          let next = m.value + delta;
          if (m.label === "API Latency") next = Math.max(45, Math.min(95, next));
          if (m.label === "Cell Vitality") next = Math.max(75, Math.min(98, next));
          if (m.label === "Active Sessions") next = Math.max(900, Math.min(1800, next));
          if (m.label === "Uptime") next = Math.max(99.5, Math.min(99.99, next));
          return { ...m, value: Math.round(next * 10) / 10 };
        })
      );
      setChartHeights((prev) =>
        prev.map((h) => Math.max(20, Math.min(90, h + (Math.random() - 0.5) * 18)))
      );
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pythag-demo">
      <div className="pythag-demo-header">
        <span className={`pythag-demo-status ${connected ? "live" : ""}`}>
          {connected ? "● Simulated live feed" : "Connecting..."}
        </span>
        <span className="pythag-demo-note">Concept demo — not production data</span>
      </div>
      <div className="pythag-demo-grid">
        {metrics.map((m) => (
          <div className="pythag-metric" key={m.label}>
            <div className="pythag-metric-top">
              <span>{m.label}</span>
              <strong>
                {m.value}
                {m.unit}
              </strong>
            </div>
            <div className="pythag-metric-bar">
              <div
                className="pythag-metric-fill"
                style={{
                  width: `${Math.min(100, (m.value / m.max) * 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="pythag-demo-chart">
        {chartHeights.map((h, i) => (
          <div
            key={i}
            className="pythag-chart-bar"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default PythagDemo;
