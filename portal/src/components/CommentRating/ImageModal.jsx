import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { fnGet } from "@utils/api";

export default function ImageModal({ comment_rating_id }) {
  const [images, setImages] = useState([]);
  useEffect(() => {
    if (images.length) return;
    fnGet({ url: `comment-rating/${comment_rating_id}/images` }).then(
      ({ data }) => {
        const mapImages = data.map((e) => ({
          original: e.images_url,
          thumbnail: e.images_url,
        }));
        setImages(mapImages);
      }
    );
  });
  return (
    <div>
      <ImageGallery
        items={images}
        showFullscreenButton={false}
        showPlayButton={false}
      />
    </div>
  );
}
