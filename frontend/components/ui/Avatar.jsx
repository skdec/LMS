"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const Avatar = ({ avatarUrl, size = "md" }) => {
  const sizeClasses = {
    sm: 32, // w-8
    md: 40, // w-10
    lg: 48, // w-12
  };

  const [imgSrc, setImgSrc] = useState(avatarUrl || "/default-avatar.png");

  useEffect(() => {
    setImgSrc(avatarUrl || "/default-avatar.png");
  }, [avatarUrl]);

  return (
    <div
      className="rounded-full overflow-hidden border"
      style={{
        width: sizeClasses[size],
        height: sizeClasses[size],
        position: "relative",
      }}
    >
      <Image
        src={imgSrc}
        alt="Avatar"
        fill
        className="object-cover rounded-full"
        onError={() => {
          if (imgSrc !== "/default-avatar.png") {
            setImgSrc("/default-avatar.png");
          }
        }}
        sizes="100%"
      />
    </div>
  );
};

export default Avatar;
