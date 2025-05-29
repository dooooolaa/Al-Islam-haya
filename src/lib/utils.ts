import * as React from "react"

export function cn(...classes: any[]): string {
  return classes.filter(Boolean).join(" ")
}

export function formatNumber(num: number): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, (match) => arabicNumerals[parseInt(match)]);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

export function generateShareLink(path: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}${path}`;
}
