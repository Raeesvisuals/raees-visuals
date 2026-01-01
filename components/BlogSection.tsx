"use client";

import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Tilt from "react-parallax-tilt";
import Link from "next/link";
import Image from "next/image";
import { sanityClient, urlFor } from "@/lib/sanity";
import Aurora from "./Aurora";

type BlogPost = {
  _id: string;
  slug: { current: string };
  title: string;
  excerpt: string;
  category: {
    _id: string;
    title: string;
    slug?: { current: string };
  } | null;
  publishedAt: string;
  featuredImage?: any;
  author?: string;
};

const POSTS_PER_PAGE = 6;

const BlogSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    async function fetchBlogPosts() {
      setIsLoading(true);
      try {
        const result = await sanityClient.fetch<BlogPost[]>(
          `*[_type == "post"] | order(publishedAt desc) {
            _id,
            slug,
            title,
            excerpt,
            category->{
              _id,
              title,
              slug
            },
            publishedAt,
            featuredImage{
              asset,
              hotspot,
              crop,
              alt
            },
            author
          }`
        );
        setPosts(result || []);

        // Fetch all blog categories separately for the filter
        const categoriesResult = await sanityClient.fetch<Array<{ title: string }>>(
          `*[_type == "blogCategory"] | order(order asc, title asc) {
            title
          }`
        );
        const categoryTitles = categoriesResult?.map((c) => c.title) || [];
        setCategories(["All", ...categoryTitles]);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category?.title === selectedCategory);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const recentPosts = posts.slice(0, 3);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="relative py-20 px-4 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ width: '100%', height: '100%', position: 'relative' }}>
        <Aurora
          colorStops={["#39209d", "#2f1499", "#261371"]}
          amplitude={0.3}
          blend={1}
        />
      </div>
      
      {/* Background Effects */}
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-primary glow-text">Stories</span>
          </h2>
          <p className="text-lg text-text-primary/70 max-w-3xl mx-auto">
            Insights, Behind the Scenes, and Creative Highlights
          </p>
          {isLoading && (
            <p className="text-sm text-text-primary/50 mt-4">Loading posts...</p>
          )}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Category Filter */}
            <motion.div
              className="flex flex-wrap gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm backdrop-blur-md border transition-all ${
                    selectedCategory === category
                      ? "bg-primary/20 border-primary text-primary font-semibold"
                      : "bg-dark-lighter/50 border-text-primary/20 text-text-primary/70 hover:border-primary/50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>

            {/* Blog Posts Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-2xl overflow-hidden animate-pulse"
                  >
                    <div className="aspect-video bg-dark-lighter/30" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-dark-lighter/30 rounded w-1/3" />
                      <div className="h-6 bg-dark-lighter/30 rounded w-full" />
                      <div className="h-4 bg-dark-lighter/30 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentPosts.map((post, index) => {
                  const imageUrl = post.featuredImage
                    ? urlFor(post.featuredImage).width(800).height(450).auto("format").url()
                    : null;

                  return (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    >
                      <Tilt
                        tiltMaxAngleX={3}
                        tiltMaxAngleY={3}
                        glareEnable={true}
                        glareMaxOpacity={0.2}
                        glareColor="#00FFFF"
                        glareBorderRadius="16px"
                        scale={1.02}
                      >
                        <Link href={`/blog/${post.slug.current}`}>
                          <motion.div
                            className="group bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-2xl overflow-hidden cursor-pointer h-full"
                            whileHover={{ borderColor: "rgba(0, 255, 255, 0.5)" }}
                          >
                            {/* Thumbnail */}
                            <div className="relative aspect-video bg-gradient-to-br from-primary/10 via-dark-lighter to-primary/5 overflow-hidden">
                              {imageUrl ? (
                                <Image
                                  src={imageUrl}
                                  alt={post.featuredImage?.alt || post.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                />
                              ) : null}
                              {/* Category Badge */}
                              {post.category?.title && (
                                <div className="absolute top-4 right-4 px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/50 rounded-full text-xs text-primary font-semibold z-10">
                                  {post.category.title}
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-6">
                              <div className="text-xs text-text-primary/50 mb-2">
                                {post.publishedAt
                                  ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })
                                  : ""}
                              </div>
                              <h3 className="text-xl font-semibold text-text-primary mb-3 group-hover:text-primary transition-colors">
                                {post.title}
                              </h3>
                              <p className="text-text-primary/60 text-sm line-clamp-2">
                                {post.excerpt}
                              </p>
                              <motion.div
                                className="mt-4 flex items-center text-primary text-sm font-medium"
                                initial={{ x: 0 }}
                                whileHover={{ x: 5 }}
                              >
                                Read More
                                <svg
                                  className="w-4 h-4 ml-2"
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
                              </motion.div>
                            </div>

                            {/* Glow Effect */}
                            <motion.div
                              className="absolute inset-0 rounded-2xl pointer-events-none"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              style={{
                                boxShadow: "inset 0 0 20px rgba(0, 255, 255, 0.1)",
                              }}
                            />
                          </motion.div>
                        </Link>
                      </Tilt>
                    </motion.div>
                  );
                })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    className="flex flex-wrap justify-center items-center gap-2 mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    {/* Previous Button */}
                    <motion.button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg text-sm backdrop-blur-md border transition-all ${
                        currentPage === 1
                          ? "bg-dark-lighter/30 border-text-primary/10 text-text-primary/30 cursor-not-allowed"
                          : "bg-dark-lighter/50 border-text-primary/20 text-text-primary/70 hover:border-primary/50 hover:text-primary"
                      }`}
                      whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                      whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                    >
                      Previous
                    </motion.button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

                      if (!showPage) {
                        // Show ellipsis
                        if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                          return (
                            <span key={pageNum} className="px-2 text-text-primary/50">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      return (
                        <motion.button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg text-sm backdrop-blur-md border transition-all ${
                            currentPage === pageNum
                              ? "bg-primary/20 border-primary text-primary font-semibold"
                              : "bg-dark-lighter/50 border-text-primary/20 text-text-primary/70 hover:border-primary/50 hover:text-primary"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {pageNum}
                        </motion.button>
                      );
                    })}

                    {/* Next Button */}
                    <motion.button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg text-sm backdrop-blur-md border transition-all ${
                        currentPage === totalPages
                          ? "bg-dark-lighter/30 border-text-primary/10 text-text-primary/30 cursor-not-allowed"
                          : "bg-dark-lighter/50 border-text-primary/20 text-text-primary/70 hover:border-primary/50 hover:text-primary"
                      }`}
                      whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                      whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                    >
                      Next
                    </motion.button>
                  </motion.div>
                )}

                {/* Page Info */}
                {filteredPosts.length > 0 && (
                  <div className="text-center mt-6 text-sm text-text-primary/50">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} of{" "}
                    {filteredPosts.length} posts
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-text-primary/60">
                No blog posts found{selectedCategory !== "All" ? ` in "${selectedCategory}"` : ""}.
              </div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div
            className="lg:w-80 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Recent Posts */}
            <div className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Recent Posts
              </h3>
              <div className="space-y-4">
                {recentPosts.length > 0 ? (
                  recentPosts.map((post) => (
                    <Link key={post._id} href={`/blog/${post.slug.current}`}>
                      <motion.div
                        className="group cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        <div className="text-sm text-text-primary/50 mb-1">
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : ""}
                        </div>
                        <div className="text-sm text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </div>
                      </motion.div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-text-primary/50">No recent posts</p>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {categories
                  .filter((cat) => cat !== "All")
                  .map((category) => (
                    <motion.button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category
                          ? "bg-primary/20 text-primary"
                          : "text-text-primary/70 hover:bg-primary/10 hover:text-primary"
                      }`}
                      whileHover={{ x: 5 }}
                    >
                      {category}
                    </motion.button>
                  ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

