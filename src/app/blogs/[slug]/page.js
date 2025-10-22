"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/translations";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { urlForImage } from "../../../sanity/lib/image";
import Image from "next/image";
import { useParams } from "next/navigation";

// ✅ Fetch Blog Post Data
async function getData(slug) {
  const query = `
    *[_type == "blogPost" && slug.current == $slug][0] {
      title { en, fr },
      mainImage {
        asset-> {
          url
        }
      },
      body { en, fr },
      publishedAt,
      category,
      description { en, fr },
      introduction { en, fr },
      suggestedBlog-> {
        title { en, fr },
        category,
        publishedAt,
        mainImage {
          asset-> {
            url
          }
        },
        slug
      },
      seo { en, fr }
    }
  `;
  return await client.fetch(query, { slug });
}

// ✅ Custom Components for PortableText Rendering
const components = {
  block: {
    h2: ({ children }) => {
      const text = children
        .map((child) => {
          if (typeof child === "string") return child;
          if (typeof child?.props?.text === "string") return child.props.text;
          return "";
        })
        .join(" ")
        .trim();
    
      if (!text) return <h2 className="text-3xl font-bold my-5">{children}</h2>;
    
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    
      return (
        <h2 id={id} className="text-3xl font-bold my-5 scroll-mt-20">
          {children}
        </h2>
      );
    },
    
    h3: ({ children }) => {
      const text = children
        .map((child) => {
          if (typeof child === "string") return child;
          if (typeof child?.props?.text === "string") return child.props.text;
          return "";
        })
        .join(" ")
        .trim();
    
      if (!text) return <h3 className="text-2xl font-bold my-4">{children}</h3>;
    
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    
      return (
        <h3 id={id} className="text-2xl font-bold my-4">
          {children}
        </h3>
      );
    },
    
    normal: ({ children }) => (
      <p className="text-lg my-4 leading-relaxed">{children}</p>
    ),
    
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 my-6 italic">
        {children}
      </blockquote>
    ),
  },
  
  // ✅ Add list handling
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside my-4 space-y-2 text-lg ml-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside my-4 space-y-2 text-lg ml-4">
        {children}
      </ol>
    ),
  },
  
  // ✅ Add list item handling
  listItem: {
    bullet: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    number: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
  },
  
  types: {
    image: ({ value }) => {
      if (!value?.asset?._id) return null;
      return (
        <div className="relative w-full my-8">
          <figure>
            <div className="relative h-[400px] w-full">
              <Image
                src={urlForImage(value).width(800).url()}
                alt={value.alt || "Sanity Image"}
                layout="fill"
                className="object-contain"
                quality={90}
              />
            </div>
            {value.caption && (
              <figcaption className="text-center text-sm text-gray-500 mt-2">
                {value.caption}
              </figcaption>
            )}
          </figure>
        </div>
      );
    },
  },
  
  marks: {
    link: ({ children, value }) => {
      const isInternal = value?.href?.startsWith("#");
      return (
        <a
          href={value.href}
          className={`text-blue-600 hover:underline ${isInternal ? "scroll-smooth" : ""}`}
        >
          {children}
        </a>
      );
    },
  },
  };

// ✅ Main BlogPost Component
const BlogPost = () => {
  const { language } = useLanguage();
  const t = translations[language]?.blog || translations.en.blog;
  const params = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!params || !params.slug) return;

      try {
        const data = await getData(params.slug);
        if (!data) {
          setPost(null);
          return;
        }
        const post = {
          ...data,
          title: data.title?.[language] || data.title?.en || "",
          excerpt: data.excerpt?.[language] || data.excerpt?.en || "",
          body: data.body?.[language] || [],
          seo: data.seo?.[language] || {},
          suggestedBlog: data.suggestedBlog
            ? {
                ...data.suggestedBlog,
                title:
                  data.suggestedBlog?.title?.[language] ||
                  data.suggestedBlog?.title?.en ||
                  "",
              }
            : null,
        };
        setPost(post);
        console.log(post);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params?.slug, language]);

  const generateSummary = (content) => {
    return content
      .filter((block) => block.style === "h2")
      .map((block) => {
        const text = block.children
          .map((child) =>
            typeof child === "string" ? child : child.text || ""
          )
          .join(" ")
          .trim();

        if (!text) return null;

        const id = text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

        return (
          <li key={id}>
            <a href={`#${id}`} className="text-white hover:underline">
              {text}
            </a>
          </li>
        );
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(
      language === "fr" ? "fr-FR" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-24 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded w-full mb-6"></div>
          <div className="h-96 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-24 px-4">
        <h1 className="text-4xl font-bold">
          {language === "en" ? "Post not found" : "Article non trouvé"}
        </h1>
      </div>
    );
  }

  return (
    <article className="container mx-auto py-24 px-4 max-w-4xl">
      <div className="mb-12">
        <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 mb-4">
          {post.category}
        </span>
        <h1 className="text-5xl font-bold mb-4">{post.title}</h1>

        <time className="text-gray-600 block mb-6">
          {formatDate(post.publishedAt)}
        </time>
        <p className="text-xl text-gray-700 mb-4">
          {post.description[language] || post.description.en}
        </p>
      </div>

      {post.mainImage && (
        <div className="relative w-full h-[500px] mb-12">
          <Image
            src={post.mainImage.asset.url}
            alt={post.title}
            fill
            className="object-cover rounded-lg"
            quality={100}
          />
        </div>
      )}
      
      {post.introduction && (
        <p className="text-xl text-gray-700 mb-8">
          {post.introduction[language] || post.introduction.en}
        </p>
      )}

      <div className="prose prose-lg max-w-none">
        <nav className="mb-6 p-4 border rounded-lg bg-primary">
          <h3 className="text-xl text-white font-semibold mb-2">{t.summary}</h3>
          <ul className="list-disc text-white pl-5">
            {generateSummary(post.body)}
          </ul>
        </nav>
        <PortableText value={post.body} components={components} />
      </div>

      {post.suggestedBlog && (
        <div className="mt-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {language === "en" ? "Suggested Blog Post" : "Article Similaire"}
            </h2>
          </div>
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            {post.suggestedBlog.mainImage && (
              <div className="relative h-48 w-full">
                <Image
                  src={post.suggestedBlog.mainImage.asset.url}
                  alt={post.suggestedBlog.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <span className="inline-block px-3 py-1 text-sm rounded-full bg-primary text-white mb-4">
                {post.suggestedBlog.category}
              </span>

              <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                {post.suggestedBlog.title}
              </h2>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.suggestedBlog.excerpt}
              </p>

              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">
                    {formatDate(post.suggestedBlog.publishedAt)}
                  </span>
                </div>

                <Link
                  href={`/blogs/${post.suggestedBlog.slug.current}`}
                  className="px-4 py-2 text-sm rounded-md border border-gray-300 
                    hover:bg-gray-50 transition-colors duration-200"
                >
                  {language === "en" ? "Read More" : "Lire la Suite"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogPost;