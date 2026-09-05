"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Patch Node DOM methods globally to prevent Google Translate from breaking React reconciliation
if (typeof window !== "undefined") {
  const win = window as any;
  if (!win.__react_google_translate_dom_patched) {
    win.__react_google_translate_dom_patched = true;

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
      if (referenceNode && referenceNode.parentNode !== this) {
        // Node was moved or wrapped by Google Translate font tags:
        // Attempt to insert relative to the referenceNode's actual parent, or append to this container
        if (referenceNode.parentNode) {
          return originalInsertBefore.call(referenceNode.parentNode, newNode, referenceNode) as T;
        }
        return originalInsertBefore.call(this, newNode, null) as T;
      }
      return originalInsertBefore.call(this, newNode, referenceNode) as T;
    };

    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      if (child.parentNode !== this) {
        // Child was moved into a Google Translate font tag: remove from its actual parent
        if (child.parentNode) {
          return child.parentNode.removeChild(child) as T;
        }
        return child;
      }
      return originalRemoveChild.call(this, child) as T;
    };

    const originalReplaceChild = Node.prototype.replaceChild;
    Node.prototype.replaceChild = function <T extends Node>(newChild: Node, oldChild: T): T {
      if (oldChild.parentNode !== this) {
        if (oldChild.parentNode) {
          return oldChild.parentNode.replaceChild(newChild, oldChild) as T;
        }
        return originalInsertBefore.call(this, newChild, null) as unknown as T;
      }
      return originalReplaceChild.call(this, newChild, oldChild) as T;
    };
  }
}

export default function TranslationRouteGuard() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isFoundation = pathname.startsWith("/foundation");

      if (isFoundation) {
        // In foundation or volunteer portal: allow translation
        document.documentElement.removeAttribute("translate");
        document.documentElement.classList.remove("notranslate");
        document.body?.removeAttribute("translate");
        document.body?.classList.remove("notranslate");
      } else {
        // In main landing page, education portal, or admin: STRICTLY PREVENT translation
        document.documentElement.setAttribute("translate", "no");
        document.documentElement.classList.add("notranslate");
        document.body?.setAttribute("translate", "no");
        document.body?.classList.add("notranslate");

        // Remove Google Translate injection classes
        document.documentElement.classList.remove("translated-ltr", "translated-rtl");
        document.body?.classList.remove("translated-ltr", "translated-rtl");

        // Reset googtrans cookie on root path so non-foundation pages stay in English
        const domain = window.location.hostname;
        document.cookie = "googtrans=/en/en; path=/;";
        document.cookie = `googtrans=/en/en; path=/; domain=${domain};`;
        document.cookie = `googtrans=/en/en; path=/; domain=.${domain};`;

        // If Google Translate dropdown exists in DOM, switch it back to English
        const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
        if (select && select.value !== "en") {
          select.value = "en";
          select.dispatchEvent(new Event("change"));
        }
      }
    }
  }, [pathname]);

  return null;
}
