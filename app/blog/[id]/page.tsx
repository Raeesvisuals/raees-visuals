"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { sanityClient, urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

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
  author?: string;
  featuredImage?: any;
  content?: PortableTextBlock[];
  tags?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
};

export default function BlogPost() {
  const params = useParams();
  const slug = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogPost() {
      setIsLoading(true);
      try {
        const result = await sanityClient.fetch<BlogPost>(
          `*[_type == "post" && slug.current == $slug][0]{
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
            author,
            featuredImage{
              asset,
              hotspot,
              crop,
              alt,
              caption
            },
            content,
            tags,
            seo
          }`,
          { slug }
        );
        setPost(result || null);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-text-primary/60">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Post Not Found
          </h1>
          <Link href="/blog">
            <motion.button
              className="px-6 py-3 bg-primary/10 border border-primary/50 rounded-lg text-primary hover:bg-primary/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back to Blog
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/blog">
            <motion.button
              className="flex items-center gap-2 text-text-primary/70 hover:text-primary transition-colors"
              whileHover={{ x: -5 }}
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blog
            </motion.button>
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Category & Date */}
          <div className="flex items-center gap-4 mb-6">
            {post.category?.title && (
              <span className="px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/50 rounded-full text-sm text-primary font-semibold">
                {post.category.title}
              </span>
            )}
            <span className="text-text-primary/50 text-sm">
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </span>
            {post.author && (
              <span className="text-text-primary/50 text-sm">by {post.author}</span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-text-primary/70 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Featured Image */}
          {post.featuredImage && (
            <motion.div
              className="relative aspect-video bg-gradient-to-br from-primary/10 via-dark-lighter to-primary/5 rounded-2xl overflow-hidden mb-12 border border-primary/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {(() => {
                const imageUrl = urlFor(post.featuredImage)
                  .width(1200)
                  .height(675)
                  .auto("format")
                  .url();
                return (
                  <Image
                    src={imageUrl}
                    alt={post.featuredImage?.alt || post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 1200px"
                  />
                );
              })()}
              {post.featuredImage?.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4 text-sm text-text-primary/80">
                  {post.featuredImage.caption}
                </div>
              )}
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            className="prose prose-invert prose-lg max-w-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {post.content && post.content.length > 0 ? (
              <PortableText
                value={post.content}
                components={{
                  block: {
                    h1: ({ children }) => (
                      <h1 className="text-4xl font-bold text-text-primary mt-8 mb-4">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-3xl font-bold text-text-primary mt-8 mb-4">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-2xl font-bold text-text-primary mt-6 mb-3">
                        {children}
                      </h3>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary pl-4 italic text-text-primary/70 my-6">
                        {children}
                      </blockquote>
                    ),
                    normal: ({ children }) => (
                      <p className="text-text-primary/80 leading-relaxed mb-4">
                        {children}
                      </p>
                    ),
                  },
                  list: {
                    bullet: ({ children }) => (
                      <ul className="list-disc list-inside space-y-2 text-text-primary/70 mb-4">
                        {children}
                      </ul>
                    ),
                    number: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-2 text-text-primary/70 mb-4">
                        {children}
                      </ol>
                    ),
                  },
                  marks: {
                    strong: ({ children }) => (
                      <strong className="font-bold text-text-primary">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    code: ({ children }) => (
                      <code className="bg-dark-lighter/50 px-2 py-1 rounded text-primary text-sm">
                        {children}
                      </code>
                    ),
                    link: ({ value, children }) => (
                      <a
                        href={value?.href}
                        target={value?.blank ? "_blank" : undefined}
                        rel={value?.blank ? "noopener noreferrer" : undefined}
                        className="text-primary hover:underline"
                      >
                        {children}
                      </a>
                    ),
                  },
                  types: {
                    image: ({ value }) => {
                      if (!value?.asset) return null;
                      const imageUrl = urlFor(value).width(800).auto("format").url();
                      return (
                        <div className="my-8">
                          <Image
                            src={imageUrl}
                            alt={value.alt || ""}
                            width={800}
                            height={450}
                            className="rounded-lg"
                          />
                          {value.caption && (
                            <p className="text-sm text-text-primary/60 mt-2 text-center">
                              {value.caption}
                            </p>
                          )}
                        </div>
                      );
                    },
                  },
                }}
              />
            ) : (
              <div className="space-y-6 text-text-primary/80 leading-relaxed">
                <p>No content available for this post.</p>
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-text-primary/10">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-xs text-primary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* CTA */}
          <motion.div
            className="mt-16 p-8 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 backdrop-blur-md border border-primary/20 rounded-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-text-primary mb-3">
              Ready to create something amazing?
            </h3>
            <p className="text-text-primary/70 mb-6">
              Let&apos;s bring your vision to life with professional video editing.
            </p>
            <Link href="/contact">
              <motion.button
                className="px-8 py-4 bg-primary/10 backdrop-blur-md border border-primary/50 rounded-lg text-primary font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get in Touch
              </motion.button>
            </Link>
          </motion.div>
        </motion.article>
      </div>
    </div>
  );
}

