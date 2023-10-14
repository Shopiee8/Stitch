"use client";

import React from "react";
import ModalImage from "react-modal-image";
import { Image, Space } from "antd";
import {
  DownloadOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
export default function CustomImageContainer({ image }) {
  const onDownload = () => {
    fetch(image)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = "image.png";
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      });
  };
  return (
    <>
      {/* <ModalImage
        small={image}
        large={image}
        zoom={true}
        className="w-[60%] max-md:w-[96%] h-[600px] max-md:h-[400px] object-cover object-top border border-none rounded-md mt-2 cursor-pointer"
      /> */}
      {/* <Image src={image} /> */}
      <div className="mt-4 cursor-pointer h-100 w-100">
        <Image
          src={image}
          height={typeof window !== "undefined" && window?.innerWidth < 992 ? 400 : 600}
          width={"100%"}
          className="object-contain bg-dark-3 object-center border border-none rounded-md mt-2 cursor-pointer"
          PreviewType={{
            visible: false,
          }}
          preview={{
            mask: false,
            maskProps: false,
            maskClosable: false,
            toolbarRender: (
              _,
              {
                transform: { scale },
                actions: {
                  onZoomOut,
                  onZoomIn,
                },
              }
            ) => (
              <Space size={24} className="toolbar-wrapper">
                <DownloadOutlined className=" text-[24px]" onClick={onDownload} />
                <ZoomOutOutlined className=" text-[24px]" disabled={scale === 1} onClick={onZoomOut} />
                <ZoomInOutlined className=" text-[24px]" disabled={scale === 50} onClick={onZoomIn} />
              </Space>
            ),
          }}
        />
      </div>
    </>
  );
}
