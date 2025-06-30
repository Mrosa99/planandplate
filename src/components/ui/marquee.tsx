import React from "react";
import Marquee from "react-fast-marquee";
import MediaCard from "./media-card";

interface MarqueeProps {
  direction?: "left" | "right";
}
const App = ({ direction }: MarqueeProps) => (
  <div className="py-1">
    <Marquee
      pauseOnHover
      direction={direction}
      gradient={true}
      gradientColor="rgb(23, 23, 23)"
      gradientWidth={75}
    >
      <MediaCard />
      <MediaCard />
      <MediaCard />
      <MediaCard />
      <MediaCard />
    </Marquee>
  </div>
);

export default App;
