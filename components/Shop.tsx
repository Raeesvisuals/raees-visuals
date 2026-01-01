"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Image from "next/image";
import { sanityClient, urlFor } from "@/lib/sanity";
import ElectricBorder from "./ElectricBorder";
import PaymentModal from "./PaymentModal";
import DownloadButton from "./DownloadButton";
import VideoModal from "./VideoModal";
import { isProductPurchased, addPurchase } from "@/data/user";
import { calculateIsNew } from "@/lib/fileMetadata";
import { FaPlay, FaDownload, FaStar, FaTag, FaShoppingCart, FaUser, FaGift, FaSearch } from "react-icons/fa";
import Link from "next/link";

type Product = {
  _id: string;
  slug: { current: string };
  title: string;
  description: string;
  categories: Array<{
    _id: string;
    title: string;
    slug?: { current: string };
  }> | null;
  tags?: string[];
  price: number;
  originalPrice?: number;
  currency: string;
  thumbnail?: any;
  previewVideo?: {
    videoType?: "youtube" | "upload";
    youtubeUrl?: string;
    videoFile?: any;
  };
  downloadFile?: {
    filePath: string;
    fileName?: string;
    fileSize?: number;
    fileFormat?: string;
    mimeType?: string;
  };
  downloadUrl?: string; // Legacy field, kept for backward compatibility
  fileSize?: string; // Legacy field
  format?: string; // Legacy field
  resolution?: string;
  features?: string[];
  isNew?: boolean;
  isPopular?: boolean;
  isOnSale?: boolean;
  rating?: number;
  downloads?: number;
  createdAt: string;
};

interface ShopProps {
  isHomepage?: boolean;
}

const Shop: React.FC<ShopProps> = ({ isHomepage = false }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleItems, setVisibleItems] = useState(8);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; product: Product | null }>({
    isOpen: false,
    product: null
  });
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; videoSrc: string; isYouTube: boolean; youtubeId?: string }>({
    isOpen: false,
    videoSrc: "",
    isYouTube: false,
  });

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const result = await sanityClient.fetch<Product[]>(
          `*[_type == "product"] | order(createdAt desc) {
            _id,
            slug,
            title,
            description,
            categories[]->{
              _id,
              title,
              slug
            },
            tags,
            price,
            originalPrice,
            currency,
            thumbnail{
              asset,
              hotspot,
              crop,
              alt
            },
            previewVideo{
              videoType,
              youtubeUrl,
              videoFile{
                asset->{
                  url,
                  mimeType
                }
              }
            },
            downloadFile{
              filePath,
              fileName,
              fileSize,
              fileFormat,
              mimeType
            },
            downloadUrl,
            fileSize,
            format,
            resolution,
            features,
            isNew,
            isPopular,
            isOnSale,
            rating,
            downloads,
            createdAt
          }`
        );
        
        console.log("📦 Shop: Products fetched:", result?.length || 0);
        console.log("📦 Shop: Products data:", result);
        
        setProducts(result || []);

        // Fetch categories
        const categoriesResult = await sanityClient.fetch<Array<{ title: string }>>(
          `*[_type == "productCategory"] | order(order asc, title asc) {
            title
          }`
        );
        const categoryTitles = categoriesResult?.map((c) => c.title) || [];
        setCategories(["All", ...categoryTitles]);

        // Extract unique tags from products
        const allTags = Array.from(
          new Set(
            result?.flatMap((p) => p.tags || []).filter(Boolean) || []
          )
        );
        setTags(allTags);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Filter products based on category, tag, and search query
  const filteredProducts = products.filter((product) => {
    // Category match - check if product has the selected category in its categories array
    const categoryMatch = activeCategory === "All" || 
      (product.categories || []).some(cat => cat?.title === activeCategory);
    
    const tagMatch = !selectedTag || (product.tags || []).includes(selectedTag);
    
    // Search filter - search in title, description, tags, and categories
    const searchMatch = !searchQuery || (() => {
      const query = searchQuery.toLowerCase();
      const titleMatch = product.title.toLowerCase().includes(query);
      const descriptionMatch = product.description.toLowerCase().includes(query);
      const tagsMatch = (product.tags || []).some(tag => tag.toLowerCase().includes(query));
      const categoriesMatch = (product.categories || []).some(cat => 
        cat?.title.toLowerCase().includes(query)
      );
      return titleMatch || descriptionMatch || tagsMatch || categoriesMatch;
    })();
    
    return categoryMatch && tagMatch && searchMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "popular":
        return (b.downloads || 0) - (a.downloads || 0);
      default:
        return 0;
    }
  });

  // Reset visible items when filters change (only for shop page)
  useEffect(() => {
    if (!isHomepage) {
      setVisibleItems(8);
    }
  }, [activeCategory, selectedTag, sortBy, searchQuery, isHomepage]);

  // Display logic based on page type
  const displayedProducts = isHomepage 
    ? sortedProducts.slice(0, 4) // Homepage: show 4 items
    : sortedProducts.slice(0, visibleItems); // Shop page: show based on visibleItems

  const hasMoreProducts = isHomepage 
    ? sortedProducts.length > 4 // Homepage: has more if total > 4
    : visibleItems < sortedProducts.length; // Shop page: has more if visible < total

  // Helper to get YouTube video ID
  const getYouTubeVideoId = (url: string): string | null => {
    try {
      if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split("?")[0];
      if (url.includes("shorts/")) return url.split("shorts/")[1].split("?")[0];
      if (url.includes("embed/")) return url.split("embed/")[1].split("?")[0];
      return new URL(url).searchParams.get("v");
    } catch {
      return null;
    }
  };

  // Handle preview video click
  const handlePreviewVideo = (product: Product) => {
    if (product.previewVideo?.videoType === "youtube" && product.previewVideo?.youtubeUrl) {
      const videoId = getYouTubeVideoId(product.previewVideo.youtubeUrl);
      setVideoModal({
        isOpen: true,
        videoSrc: product.previewVideo.youtubeUrl,
        isYouTube: true,
        youtubeId: videoId || undefined,
      });
    } else if (product.previewVideo?.videoFile?.asset?.url) {
      setVideoModal({
        isOpen: true,
        videoSrc: product.previewVideo.videoFile.asset.url,
        isYouTube: false,
      });
    }
  };

  // Function to load more items (shop page only)
  const loadMoreItems = () => {
    if (!isHomepage) {
      setVisibleItems(prev => Math.min(prev + 8, sortedProducts.length));
    }
  };

  // Payment handlers
  const handleBuyProduct = (product: Product) => {
    setPaymentModal({ isOpen: true, product });
  };

  const handlePaymentSuccess = (productId: string) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      const thumbnailUrl = product.thumbnail
        ? urlFor(product.thumbnail).width(400).url()
        : "";
      addPurchase({
        id: Date.now().toString(),
        productId: product._id,
        productTitle: product.title,
        productThumbnail: thumbnailUrl,
        downloadUrl: product.downloadUrl || product.downloadFile?.filePath || '',
        purchaseDate: new Date().toISOString(),
        amount: product.price,
        status: 'completed'
      });
    }
    setPaymentModal({ isOpen: false, product: null });
  };

  const closePaymentModal = () => {
    setPaymentModal({ isOpen: false, product: null });
  };

  return (
    <section id="shop" className="relative py-20 px-4 overflow-hidden min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-dark to-dark" />
      </div>
      
      {/* Glassmorphic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-lighter/30 to-dark pointer-events-none" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{
              x: Math.random() * 1920,
              y: Math.random() * 1080,
            }}
            animate={{
              y: [null, Math.random() * 1080],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-end mb-6">
            <Link href="/account">
              <motion.button
                className="flex items-center gap-2 px-4 py-2 bg-dark-lighter/50 backdrop-blur-md border border-text-primary/20 rounded-lg text-text-primary hover:border-primary/50 hover:text-primary transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUser />
                My Account
              </motion.button>
            </Link>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Shop <span className="text-primary glow-text">Templates & LUTs</span>
          </h2>
          <p className="text-lg text-text-primary/70 max-w-3xl mx-auto">
            High-quality video assets to elevate your projects. Professional templates, 
            cinematic LUTs, and motion graphics to bring your vision to life.
          </p>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Search Bar */}
          <div className="mb-8 max-w-2xl mx-auto">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-primary/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name, description, tags, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-dark-lighter/50 backdrop-blur-md border border-text-primary/20 rounded-lg text-text-primary placeholder-text-primary/40 focus:border-primary focus:outline-none transition-all"
              />
              {searchQuery && (
                <motion.button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-primary/50 hover:text-text-primary transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              )}
            </motion.div>
            {searchQuery && (
              <motion.p
                className="mt-2 text-sm text-text-primary/60 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {filteredProducts.length === 0
                  ? "No products found matching your search"
                  : `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} matching "${searchQuery}"`}
              </motion.p>
            )}
          </div>

          {/* Category Filter */}
          {isLoading ? (
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-24 bg-dark-lighter/30 rounded-full animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full backdrop-blur-md border transition-all ${
                    activeCategory === category
                      ? "bg-primary/20 border-primary text-primary font-semibold glow-border"
                      : "bg-dark-lighter/50 border-text-primary/20 text-text-primary/70 hover:border-primary/50 hover:text-text-primary"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          )}

          {/* Tag Filter */}
          {isLoading ? (
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-7 w-20 bg-dark-lighter/30 rounded-full animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {tags.slice(0, 8).map((tag) => (
                <motion.button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-4 py-1 rounded-full text-sm backdrop-blur-md border transition-all ${
                    selectedTag === tag
                      ? "bg-secondary/20 border-secondary text-secondary font-semibold"
                      : "bg-dark-lighter/30 border-text-primary/10 text-text-primary/60 hover:border-secondary/50 hover:text-secondary"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTag className="inline w-3 h-3 mr-1" />
                  {tag}
                </motion.button>
              ))}
            </div>
          )}

          {/* Sort Options */}
          <div className="flex justify-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-dark-lighter/50 backdrop-blur-md border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </motion.div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-dark-lighter/30" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-dark-lighter/30 rounded w-2/3" />
                  <div className="h-6 bg-dark-lighter/30 rounded w-full" />
                  <div className="h-4 bg-dark-lighter/30 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${selectedTag}-${sortBy}-${searchQuery}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
            >
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product, index) => {
                  const thumbnailUrl = product.thumbnail
                    ? urlFor(product.thumbnail).width(800).height(450).auto("format").url()
                    : null;
                  
                  return (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="h-full"
                    >
                <ElectricBorder
                  color="#7df9ff"
                  speed={1}
                  chaos={0.5}
                  thickness={2}
                  style={{ borderRadius: 16 }}
                >
                  <Tilt
                    tiltMaxAngleX={5}
                    tiltMaxAngleY={5}
                    glareEnable={true}
                    glareMaxOpacity={0.3}
                    glareColor="#7df9ff"
                    glareBorderRadius="16px"
                    scale={1.02}
                  >
                    <Link href={`/shop/${product.slug.current}`}>
                      <motion.div
                        className="group relative bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col"
                        whileHover={{ borderColor: "rgba(125, 249, 255, 0.5)" }}
                      >
                      {/* Product Thumbnail */}
                      <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-dark-lighter overflow-hidden">
                        {thumbnailUrl ? (
                          <Image 
                            src={thumbnailUrl} 
                            alt={product.thumbnail?.alt || product.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-dark-lighter to-primary/5" />
                        )}
                        
                        {/* Preview Video Overlay */}
                        {(product.previewVideo?.youtubeUrl || product.previewVideo?.videoFile?.asset?.url) && (
                          <motion.button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handlePreviewVideo(product);
                            }}
                            className="absolute inset-0 bg-primary/20 flex items-center justify-center cursor-pointer z-10"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <motion.div
                              className="w-16 h-16 rounded-full bg-primary/30 backdrop-blur-md border border-primary flex items-center justify-center"
                              whileHover={{ scale: 1.1 }}
                            >
                              <FaPlay className="text-primary text-xl ml-1" />
                            </motion.div>
                          </motion.button>
                        )}

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {(product.isNew || calculateIsNew(product.createdAt)) && (
                            <span className="px-2 py-1 bg-primary/20 backdrop-blur-md border border-primary/50 rounded-full text-xs text-primary font-semibold">
                              NEW
                            </span>
                          )}
                          {product.isPopular && (
                            <span className="px-2 py-1 bg-secondary/20 backdrop-blur-md border border-secondary/50 rounded-full text-xs text-secondary font-semibold">
                              POPULAR
                            </span>
                          )}
                          {product.isOnSale && (
                            <span className="px-2 py-1 bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-full text-xs text-red-400 font-semibold">
                              SALE
                            </span>
                          )}
                        </div>

                        {/* Category Badges */}
                        {product.categories && product.categories.length > 0 && (
                          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                            {product.categories.slice(0, 2).map((category) => (
                              <div
                                key={category._id}
                                className="px-3 py-1 bg-dark-lighter/80 backdrop-blur-md border border-text-primary/20 rounded-full text-xs text-text-primary font-semibold"
                              >
                                {category.title}
                              </div>
                            ))}
                            {product.categories.length > 2 && (
                              <div className="px-3 py-1 bg-dark-lighter/80 backdrop-blur-md border border-text-primary/20 rounded-full text-xs text-text-primary font-semibold">
                                +{product.categories.length - 2}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-6 flex flex-col flex-1 min-h-0">
                        <div className="flex-1 min-h-0 flex flex-col">
                          <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                            {product.title}
                          </h3>
                          <p className="text-text-primary/60 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                            {product.description}
                          </p>
                          
                          {/* Rating and Downloads */}
                          <div className="flex items-center gap-4 mb-3 text-sm text-text-primary/60 min-h-[1.5rem]">
                            {product.rating && (
                              <div className="flex items-center gap-1">
                                <FaStar className="text-yellow-400" />
                                <span>{product.rating}</span>
                              </div>
                            )}
                            {product.downloads && (
                              <div className="flex items-center gap-1">
                                <FaDownload />
                                <span>{product.downloads.toLocaleString()}</span>
                              </div>
                            )}
                          </div>

                          {/* Tags */}
                          {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3 min-h-[1.75rem]">
                              {product.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-primary/10 border border-primary/20 rounded text-xs text-primary"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Price and Buy Button */}
                        <div className="mt-auto pt-4 border-t border-text-primary/10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-primary">
                                ${product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-text-primary/50 line-through text-sm">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>
                            <span className="text-text-primary/60 text-xs">
                              {product.currency}
                            </span>
                          </div>
                          
                          {product.price === 0 ? (
                            // Free product - use DownloadButton if file path exists
                            product.downloadFile?.filePath ? (
                              <DownloadButton
                                productId={product.slug.current}
                                fileName={product.downloadFile.fileName}
                                className="w-full py-3 bg-green-500/20 backdrop-blur-md border border-green-500/50 rounded-lg text-green-400 font-semibold"
                              />
                            ) : (
                              <motion.button
                                className="w-full py-3 bg-green-500/20 backdrop-blur-md border border-green-500/50 rounded-lg text-green-400 font-semibold flex items-center justify-center gap-2 hover:bg-green-500/30 transition-colors opacity-50 cursor-not-allowed"
                                disabled
                              >
                                <FaGift />
                                Download Not Available
                              </motion.button>
                            )
                          ) : isProductPurchased(product._id) ? (
                            // Purchased product - show download button
                            product.downloadFile?.filePath ? (
                              <DownloadButton
                                productId={product.slug.current}
                                fileName={product.downloadFile.fileName}
                                className="w-full py-3 bg-green-500/20 backdrop-blur-md border border-green-500/50 rounded-lg text-green-400 font-semibold"
                              />
                            ) : (
                              <Link href="/account">
                                <motion.button
                                  className="w-full py-3 bg-green-500/20 backdrop-blur-md border border-green-500/50 rounded-lg text-green-400 font-semibold flex items-center justify-center gap-2 hover:bg-green-500/30 transition-colors"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <FaDownload />
                                  Download Now
                                </motion.button>
                              </Link>
                            )
                          ) : (
                            // Paid product - show buy button
                            <motion.button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleBuyProduct(product);
                              }}
                              className="w-full py-3 bg-primary/10 backdrop-blur-md border border-primary/50 rounded-lg text-primary font-semibold flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <FaShoppingCart />
                              Buy Now - ${product.price}
                            </motion.button>
                          )}
                        </div>
                      </div>

                      {/* Glow Effect on Hover */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          boxShadow: "inset 0 0 20px rgba(125, 249, 255, 0.2)",
                        }}
                      />
                      </motion.div>
                    </Link>
                  </Tilt>
                </ElectricBorder>
              </motion.div>
                );
              })
              ) : (
                <div className="col-span-full text-center py-12 text-text-primary/60">
                  No products found{activeCategory !== "All" ? ` in "${activeCategory}"` : ""}
                  {selectedTag ? ` tagged with "${selectedTag}"` : ""}.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Show More Button */}
        {hasMoreProducts && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {isHomepage ? (
              // Homepage: Link to shop page
              <motion.a
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary/10 backdrop-blur-md border border-primary/50 rounded-lg text-primary font-semibold hover:bg-primary/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Show More Products
                <svg
                  className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.a>
            ) : (
              // Shop page: Load more items
              <motion.button
                onClick={loadMoreItems}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary/10 backdrop-blur-md border border-primary/50 rounded-lg text-primary font-semibold hover:bg-primary/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Show More Products
                <svg
                  className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Results Count */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-text-primary/60">
            {isHomepage ? (
              <>
                Featured products: {displayedProducts.length} of {sortedProducts.length} total
                {activeCategory !== "All" && ` in ${activeCategory}`}
                {selectedTag && ` tagged with "${selectedTag}"`}
              </>
            ) : (
              <>
                Showing {displayedProducts.length} of {sortedProducts.length} products
                {activeCategory !== "All" && ` in ${activeCategory}`}
                {selectedTag && ` tagged with "${selectedTag}"`}
                {searchQuery && ` matching "${searchQuery}"`}
              </>
            )}
          </p>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={closePaymentModal}
        product={paymentModal.product}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </section>
  );
};

export default Shop;
