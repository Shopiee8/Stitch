"use client";
import React from "react";
import { StarIcon } from "../../public/svg";
import ReactStars from "react-rating-stars-component";
import { addStarsToThread } from "@/lib/actions/thread.actions";
import { usePathname } from "next/navigation";
export default function ReactStarsRating({
  threadId,
  userId,
  ratedStars,
  ...props
}) {
  const path = usePathname();

  const ratingChanged = async (newRating) => {
    await addStarsToThread({
      threadId,
      userId,
      stars: newRating,
      path,
    });
  };

  return (
    <ReactStars
      count={5}
      size={typeof window !== "undefined" && window.innerWidth < 992 ? 18 : 24}
      value={ratedStars}
      onChange={ratingChanged}
      activeColor="#ffd700"
      fillIcon={<StarIcon />}
    />
  );
}
