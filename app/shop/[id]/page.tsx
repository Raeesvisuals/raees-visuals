"use client";

import React, { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { sanityClient, urlFor } from "@/lib/sanity";
import ElectricBorder from "@/components/ElectricBorder";
import PaymentModal from "@/components/PaymentModal";
import DownloadButton from "@/components/DownloadButton";
import VideoModal from "@/components/VideoModal";
import {
  FaPlay,
  FaDownload,
  FaStar,
  FaShoppingCart,
  FaArrowLeft,
  FaTag,
  FaCalendar,
  FaFile,
} from "react-icons/fa";

/* ================= TYPES ================= */

type Category = {
  _id: string;
  title: string;
  slug?: { current: string };
};

type Product = {
  _id: string;
  slug: { current: string };
  title: string;
  description: string;
  category: Category | null;
  tags?: string[];
  price: number;
  originalPrice?: number;
  currency: string;
  thumbnail?: any;
  previewVideo?: {
    videoType?: "youtube" | "upload";
    youtubeUrl?: string;
    videoFile?: {
      asset?: {
        url?: string;
        mimeType?: string;
      };
    };
  };
  downloadFile?: {
    filePath: string;
    fileName?: string;
    fileSize?: number;
    fileFormat?: string;
    mimeType?: string;
  };
  features?: string[];
  isNew?: boolean;
  isPopular?: boolean;
  isOnSale?: boolean;
  rating?: number;
  downloads?: number;
  createdAt: string;
};

/* ================= HELPERS ================= */

function formatFileSize(bytes: number): string {
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

/* ================= PAGE ================= */

export default function ProductPage() {
  const params = useParams();
  const slug = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; product: Product | null }>({
    isOpen: false,
    product: null,
  });
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; videoSrc: string; isYouTube: boolean; youtubeId?: string }>({
    isOpen: false,
    videoSrc: "",
    isYouTube: false,
  });

  /* ================= DATA FETCH ================= */

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      try {
        const result = await sanityClient.fetch<Product>(
          `*[_type == "product" && slug.current == $slug][0]{
            _id,
            slug,
            title,
            description,
            category->{
              _id,
              title,
              slug
            },
            tags,
            price,
            originalPrice,
            currency,
            thumbnail,
            previewVideo,
            downloadFile,
            features,
            isNew,
            isPopular,
            isOnSale,
            rating,
            downloads,
            createdAt
          }`,
          { slug }
        );

        if (!result) {
          setProduct(null);
          return;
        }

        setProduct(result);

        if (result.category?._id) {
          const related = await sanityClient.fetch<Product[]>(
            `*[_type == "product" && references($categoryId) && slug.current != $slug][0...3]{
              _id,
              slug,
              title,
              price,
              category->{
                _id,
                title
              },
              thumbnail
            }`,
            {
              categoryId: result.category._id,
              slug,
            }
          );

          setRelatedProducts(related || []);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) fetchProduct();
  }, [slug]);

  if (isLoading) {
    return <div className="min-h-screen bg-dark flex items-center justify-center text-text-primary/60">Loading…</div>;
  }

  if (!product) notFound();

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-dark relative">
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-dark to-dark" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <Link href="/shop" className="inline-flex items-center gap-2 mb-8 text-text-primary hover:text-primary">
          <FaArrowLeft /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* MEDIA */}
          <ElectricBorder>
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              {product.thumbnail && (
                <Image
                  src={urlFor(product.thumbnail).width(1200).height(675).url()}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </ElectricBorder>

          {/* INFO */}
          <div className="space-y-6">
            {product.category && (
              <span className="inline-block px-3 py-1 bg-primary/20 rounded-full text-primary">
                {product.category.title}
              </span>
            )}

            <h1 className="text-4xl font-bold text-text-primary">{product.title}</h1>
            <p className="text-text-primary/70">{product.description}</p>

            <div className="text-3xl font-bold text-primary">${product.price}</div>

            {product.price === 0 && product.downloadFile?.filePath ? (
              <DownloadButton productId={product.slug.current} />
            ) : (
              <button
                onClick={() => setPaymentModal({ isOpen: true, product })}
                className="w-full py-4 bg-primary/10 border border-primary/40 rounded-lg text-primary"
              >
                <FaShoppingCart /> Buy Now
              </button>
            )}
          </div>
        </div>

        {/* RELATED */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-8 text-text-primary">Related Products</h2>

          {relatedProducts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <Link key={p._id} href={`/shop/${p.slug.current}`}>
                  <div className="bg-dark-lighter p-4 rounded-xl hover:border-primary border">
                    <h3 className="text-lg font-semibold text-text-primary">{p.title}</h3>
                    <span className="text-primary font-bold">${p.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-text-primary/60">No related products found.</p>
          )}
        </div>
      </div>

      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, product: null })}
        product={paymentModal.product}
        onPaymentSuccess={() => setPaymentModal({ isOpen: false, product: null })}
      />

      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={() => setVideoModal({ isOpen: false, videoSrc: "", isYouTube: false })}
        videoSrc={videoModal.videoSrc}
        isYouTube={videoModal.isYouTube}
        youtubeId={videoModal.youtubeId}
        format="horizontal"
      />
    </div>
  );
}
