
 //ImageGallery.jsx
// Uses imageFetcher utility to request up to 5 images from Pexels
 

import React, { useEffect, useState } from "react";
import { imageFetcher } from "../utils/imageFetcher";
import { FaImage } from "react-icons/fa";

export default function ImageGallery({ condition = "", locationName = "", locationQuery = "" }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const imgs = await imageFetcher({
          queries: [
            condition,
            `${condition} weather`,
            `${locationName} ${condition}`,
            `${locationName} skyline`,
            `weather ${locationName}`,
            "weather",
          ],
          per_page: 5,
        });
        if (!mounted) return;
        setImages(imgs || []);
      } catch (err) {
        console.warn("Images fetch failed", err);
        if (mounted) setError("No images found");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [condition, locationName, locationQuery]);

  if (loading) {
    return (
      <div className="bg-white/4 dark:bg-[#04202a]/30 border border-white/8 rounded-lg p-3 h-56 flex items-center justify-center">
        <div className="animate-pulse text-sky-200">Loading images…</div>
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className="bg-gradient-to-br from-sky-600/20 to-sky-400/10 rounded-lg p-3 h-56 flex items-center justify-center">
        <div className="text-sky-100 text-center">
          <FaImage className="mx-auto mb-2 text-sky-200" />
          <div className="text-sm">No photos available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/3 dark:bg-[#04202a]/20 border border-white/8 rounded-lg p-2">
      <h4 className="text-white text-sm font-semibold mb-2">Photos</h4>
      {/* Desktop: 2x2 grid. Mobile: horizontal scroll */}
      <div className="hidden md:grid grid-cols-2 gap-2">
        {images.slice(0, 4).map((img, i) => (
          <img key={i} src={img.src.medium} alt={img.alt || "Clima photo"} className="w-full h-28 object-cover rounded-md" />
        ))}
      </div>

      <div className="md:hidden flex gap-2 overflow-x-auto">
        {images.map((img, i) => (
          <img key={i} src={img.src.medium} alt={img.alt || "Clima photo"} className="w-40 h-28 object-cover rounded-md flex-shrink-0" />
        ))}
      </div>
    </div>
  );
}
