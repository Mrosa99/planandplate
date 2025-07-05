"use client";

import React from "react";

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className=" text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-2 gap-8">
        <div className="h-full w-full flex flex-col">
          <h2 className="text-white text-lg font-semibold">
            Plan and Plate — Discover recipes & plan your meals easily
          </h2>
          <p>
            ✉️
            <a href="/test" className="text-white hover:text-gray-300">
              Email
            </a>
          </p>
          <a
            href="/test"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300"
          >
            GitHub
          </a>
          <a
            href="/test"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300"
          >
            LinkedIn
          </a>
        </div>

        <div className="ml-10">
          <h2 className="text-white text-lg font-semibold">
            Built with React, Tailwind CSS, FastAPI
          </h2>
          <button
            onClick={scrollToTop}
            className="text-amber-400 hover:text-amber-500 text-sm transition"
            aria-label="Back to top"
          >
            ↑ Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}
