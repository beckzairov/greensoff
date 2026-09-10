'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const allImages = [
    { id: 1, src: '/gallery/IMG_3041.jpg', alt: 'Image 1' },
    { id: 2, src: '/gallery/IMG_3042.jpg', alt: 'Image 2' },
    { id: 3, src: '/gallery/IMG_3045.jpg', alt: 'Image 3' },
    { id: 4, src: '/gallery/IMG_3046.jpg', alt: 'Image 4' },
    { id: 5, src: '/gallery/IMG_3049.jpg', alt: 'Image 5' },
    { id: 6, src: '/gallery/IMG_3052.jpg', alt: 'Image 6' },
    // { id: 7, src: '/gallery/image2.jpg', alt: 'Image 7' },
    // { id: 8, src: '/gallery/image3.jpg', alt: 'Image 8' },
    // { id: 9, src: '/gallery/image4.jpg', alt: 'Image 9' },
    // { id: 10, src: '/gallery/image5.jpg', alt: 'Image 10' },
];

const batchSize = 6; // Load 6 images per batch

export default function ImageGallery() {
    const [images, setImages] = useState([]);
    const [loaded, setLoaded] = useState({});
    const [visibleCount, setVisibleCount] = useState(batchSize);

    // Load initial batch
    useEffect(() => {
        loadImages(visibleCount);
    }, [visibleCount]);

    const loadImages = (count) => {
        setImages(allImages.slice(0, count));
    };

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + batchSize);
    };

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-10">Image Gallery</h2>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            className={`relative overflow-hidden rounded-lg shadow-lg ${
                                index === 2 || index === 6 ? 'row-span-2' : '' // Make image 3 and 7 taller
                            } ${index === 3 || index === 7 ? 'col-span-2' : ''}`} // Make 4 and 8 wider
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                width={600}
                                height={400}
                                placeholder="blur"
                                blurDataURL="/images/placeholder.jpg"
                                className={`w-full h-full object-cover transition-opacity duration-500 ${
                                    loaded[image.id] ? 'opacity-100' : 'opacity-0'
                                }`}
                                onLoadingComplete={() => setLoaded((prev) => ({ ...prev, [image.id]: true }))}
                            />
                        </div>
                    ))}
                </div>

                {visibleCount < allImages.length && (
                    <div className="text-center mt-8">
                        <button
                            onClick={handleLoadMore}
                            className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-500 transition"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
