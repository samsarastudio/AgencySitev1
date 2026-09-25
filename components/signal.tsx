"use client";
import { useState } from "react";
const nodes = [
  ["Idea", "Start with the moment you want people to remember."],
  ["Software", "Make each step easy for your guests to follow."],
  ["Hardware", "Connect the cameras, sensors, displays and prints."],
  ["Experience", "Put it all together and see how it feels to take part."],
];
export function Signal() {
  const [active, setActive] = useState(0);
  return (
    <div className="signal">
      <div
        className="signal-nodes"
        aria-label="Explore how we connect an experience"
      >
        {nodes.map(([name], i) => (
          <button
            key={name}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            <small>0{i + 1}</small>
            {name}
            <span aria-hidden="true">{i < 3 ? "→" : "↗"}</span>
          </button>
        ))}
      </div>
      <p aria-live="polite">{nodes[active][1]}</p>
    </div>
  );
}
