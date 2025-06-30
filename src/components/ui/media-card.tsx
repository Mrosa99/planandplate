"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";

export default function MediaCard() {
  return (
    <Card sx={{ maxWidth: 345, maxHeight: 340 }}>
      <CardActionArea onClick={() => (window.location.href = "/test")}>
        <CardMedia
          component="img"
          height="340"
          image="/spaghetti.png"
          alt="Spaghetti"
          sx={{ objectFit: "cover" }}
        />
      </CardActionArea>
    </Card>
  );
}
