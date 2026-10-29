"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaXmark } from "react-icons/fa6";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="wv-header">
      <div className="wv-header-inner">
        <Link href="/" className="wv-header-brand" onClick={closeMenu}>
          Where Is Venom?
        </Link>

        <nav className="wv-header-nav-desktop" aria-label="Main Navigation">
          <Link href="/#hero" className="wv-nav-link">Home</Link>
          <Link href="/#story" className="wv-nav-link">His Story</Link>
          <Link href="/#beyond" className="wv-nav-link">Memories</Link>
          <Link href="/#share-memory" className="wv-nav-link">Share a Memory</Link>
          <Link href="/#contact" className="wv-nav-link">Contact</Link>
        </nav>

        <button
          type="button"
          className="wv-header-mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <FaXmark /> : <FaBars />}
        </button>
      </div>

      {menuOpen && (
        <div className="wv-mobile-menu">
          <nav className="wv-mobile-nav" aria-label="Mobile Navigation">
            <Link href="/#hero" className="wv-mobile-nav-link" onClick={closeMenu}>
              Home
            </Link>
            <Link href="/#story" className="wv-mobile-nav-link" onClick={closeMenu}>
              His Story
            </Link>
            <Link href="/#beyond" className="wv-mobile-nav-link" onClick={closeMenu}>
              Memories
            </Link>
            <Link href="/#share-memory" className="wv-mobile-nav-link" onClick={closeMenu}>
              Share a Memory
            </Link>
            <Link href="/#contact" className="wv-mobile-nav-link" onClick={closeMenu}>
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
