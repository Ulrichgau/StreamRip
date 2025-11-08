import type { Express } from "express";
import { createServer, type Server } from "http";
import axios from "axios";
import * as cheerio from "cheerio";
import { extractMp3Schema, type ExtractMp3Response, type Mp3Result } from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/extract-mp3", async (req, res) => {
    try {
      const validation = extractMp3Schema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid URL", 
          details: validation.error.errors 
        });
      }

      const { url } = validation.data;

      // Fetch the webpage
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000,
        maxRedirects: 5,
      });

      const html = response.data;
      const $ = cheerio.load(html);
      const results: Mp3Result[] = [];
      const seenUrls = new Set<string>();

      // Extract from <audio> tags
      $('audio').each((_, element) => {
        const src = $(element).attr('src');
        if (src && src.toLowerCase().endsWith('.mp3')) {
          const absoluteUrl = new URL(src, url).href;
          if (!seenUrls.has(absoluteUrl)) {
            seenUrls.add(absoluteUrl);
            results.push({
              id: randomUUID(),
              filename: extractFilename(absoluteUrl),
              url: absoluteUrl,
              source: '<audio> tag',
            });
          }
        }
      });

      // Extract from <source> elements within audio tags
      $('audio source').each((_, element) => {
        const src = $(element).attr('src');
        if (src && src.toLowerCase().endsWith('.mp3')) {
          const absoluteUrl = new URL(src, url).href;
          if (!seenUrls.has(absoluteUrl)) {
            seenUrls.add(absoluteUrl);
            results.push({
              id: randomUUID(),
              filename: extractFilename(absoluteUrl),
              url: absoluteUrl,
              source: '<source> element',
            });
          }
        }
      });

      // Extract direct links (href ending in .mp3)
      $('a[href$=".mp3"], a[href*=".mp3?"]').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          const absoluteUrl = new URL(href, url).href;
          if (!seenUrls.has(absoluteUrl)) {
            seenUrls.add(absoluteUrl);
            results.push({
              id: randomUUID(),
              filename: extractFilename(absoluteUrl),
              url: absoluteUrl,
              source: 'Direct link',
            });
          }
        }
      });

      // Search for MP3 URLs in the raw HTML (catches URLs in scripts, etc.)
      const mp3UrlRegex = /https?:\/\/[^\s"'<>]+\.mp3(?:\?[^\s"'<>]*)?/gi;
      const matches = html.match(mp3UrlRegex);
      if (matches) {
        matches.forEach((match: string) => {
          if (!seenUrls.has(match)) {
            seenUrls.add(match);
            results.push({
              id: randomUUID(),
              filename: extractFilename(match),
              url: match,
              source: 'Found in HTML',
            });
          }
        });
      }

      const extractResponse: ExtractMp3Response = {
        results,
        sourceUrl: url,
      };

      res.json(extractResponse);
    } catch (error: any) {
      console.error("Error extracting MP3s:", error);
      
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        return res.status(400).json({ 
          error: "Could not reach the URL. Please check the address and try again." 
        });
      }
      
      if (error.response?.status === 404) {
        return res.status(404).json({ 
          error: "The webpage was not found (404)." 
        });
      }

      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        return res.status(408).json({ 
          error: "Request timed out. The server took too long to respond." 
        });
      }

      res.status(500).json({ 
        error: "Failed to extract MP3s from the webpage. Please try again." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function extractFilename(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop() || 'unknown.mp3';
    return decodeURIComponent(filename);
  } catch {
    return 'unknown.mp3';
  }
}
