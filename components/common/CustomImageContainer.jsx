"use client";

import React from "react";
import ModalImage from "react-modal-image";

export default function CustomImageContainer({ image }) {
  return (
    <>
      <ModalImage
        small={image}
        large={image}
        className="w-[60%] max-md:w-[96%] h-[600px] max-md:h-[400px] object-cover object-top border border-none rounded-md mt-2 cursor-pointer"
      />
    </>
  );
}
