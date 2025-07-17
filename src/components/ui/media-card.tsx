"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";

interface MediaCardProps {
  image: string;
  title: string;
}

const MediaCard: React.FC<MediaCardProps> = ({ image, title }) => {
  return (
    <div className="transition-transform duration-500 ease-out hover:scale-105 hover:-translate-y-1 hover:shadow-2xl overflow-hidden">
      <Card
        className="border-2 border-gray-500 m-4"
        sx={{ maxWidth: 345, maxHeight: 340 }}
      >
        <CardActionArea onClick={() => (window.location.href = "/test")}>
          <CardMedia
            component="img"
            height="340"
            image={image}
            alt={title}
            sx={{ objectFit: "cover" }}
          />
        </CardActionArea>
      </Card>
    </div>
  );
};

export default MediaCard;
