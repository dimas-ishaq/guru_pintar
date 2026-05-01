
/**
 * DuckDuckGo Search Service
 * Free real-time search without API key
 * Uses DuckDuckGo's HTML interface for scraping
 */

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export interface SearchOptions {
  query: string;
  maxResults?: number;
  language?: string;
}

/**
 * Scrape DuckDuckGo search results
 * Uses the HTML version of DuckDuckGo (no API key required)
 */
export async function searchDuckDuckGo(options: SearchOptions): Promise<SearchResult[]> {
  const { query, maxResults = 10, language = 'id' } = options;

  try {
    // Encode query for URL
    const encodedQuery = encodeURIComponent(query);

    // DuckDuckGo HTML search URL
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodedQuery}&lr=lang_${language}`;

    // Fetch search results
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': `${language},en;q=0.5`,
      },
    });

    if (!response.ok) {
      console.error(`DuckDuckGo search failed: ${response.status}`);
      return [];
    }

    const html = await response.text();

    // Parse results from HTML
    const results = parseSearchResults(html, maxResults);

    return results;
  } catch (error) {
    console.error('DuckDuckGo search error:', error);
    return [];
  }
}

/**
 * Parse DuckDuckGo HTML results into structured data
 */
function parseSearchResults(html: string, maxResults: number): SearchResult[] {
  const results: SearchResult[] = [];

  // DuckDuckGo HTML result pattern
  // Each result is in a div with class "result"
  const resultPattern = /<a class="result__a" href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
  const snippetPattern = /<a class="result__snippet"[^>]*>([^<]+)<\/a>/gi;

  // Alternative pattern for newer DuckDuckGo HTML format
  const altResultPattern = /<h2[^>]*>[^<]*<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;

  // Try to extract results using multiple patterns
  let match;
  let resultUrls: string[] = [];
  let resultTitles: string[] = [];
  let resultSnippets: string[] = [];

  // Extract URLs and titles
  const urlTitleRegex = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
  while ((match = urlTitleRegex.exec(html)) !== null && resultUrls.length < maxResults) {
    resultUrls.push(match[1]);
    resultTitles.push(stripHtml(match[2]));
  }

  // Extract snippets
  const snippetRegex = /<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([^<]+)<\/a>/gi;
  while ((match = snippetRegex.exec(html)) !== null) {
    resultSnippets.push(stripHtml(match[1]));
  }

  // Alternative: Extract from data attributes or JSON
  const jsonPattern = /"u":"([^"]+)".*?"t":"([^"]+)"/gi;
  while ((match = jsonPattern.exec(html)) !== null && results.length < maxResults) {
    results.push({
      title: decodeURIComponent(escapeUnicode(match[2])),
      snippet: '',
      url: decodeURIComponent(escapeUnicode(match[1])),
    });
  }

  // Combine results
  for (let i = 0; i < Math.min(resultUrls.length, maxResults); i++) {
    results.push({
      title: resultTitles[i] || '',
      snippet: resultSnippets[i] || '',
      url: resultUrls[i] || '',
    });
  }

  // If still no results, try alternative parsing
  if (results.length === 0) {
    return parseAlternativeResults(html, maxResults);
  }

  return results.slice(0, maxResults);
}

/**
 * Alternative parsing for different DuckDuckGo HTML formats
 */
function parseAlternativeResults(html: string, maxResults: number): SearchResult[] {
  const results: SearchResult[] = [];

  // Try to find all links with result class
  const linkPattern = /<a[^>]+href="(https?:\/\/[^"]+)"[^>]*>([^<]+)<\/a>/gi;
  let match;

  const seenUrls = new Set<string>();

  while ((match = linkPattern.exec(html)) !== null && results.length < maxResults) {
    const url = match[1];
    const title = stripHtml(match[2]);

    // Skip if already seen or if it's a DuckDuckGo internal link
    if (seenUrls.has(url) || url.includes('duckduckgo')) {
      continue;
    }

    // Skip empty or very short titles
    if (title.length < 5) {
      continue;
    }

    seenUrls.add(url);
    results.push({
      title,
      snippet: '',
      url,
    });
  }

  return results;
}

/**
 * Strip HTML tags from string
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .trim();
}

/**
 * Escape unicode sequences for decoding
 */
function escapeUnicode(str: string): string {
  return str.replace(/\\u([0-9a-f]{4})/gi, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
}

/**
 * Build search query for Kurikulum Merdeka context
 */
export function buildKurikulumSearchQuery(
  subject: string,
  phase: string,
  topic?: string
): string {
  const parts = [
    'Kurikulum Merdeka',
    subject,
    `Fase ${phase}`,
  ];

  if (topic) {
    parts.push(topic);
  }

  // Add specific Indonesian education terms
  parts.push('CP Capaian Pembelajaran');

  return parts.join(' ');
}

/**
 * Search for Kurikulum Merdeka references
 */
export async function searchKurikulumMerdeka(
  subject: string,
  phase: string,
  options?: {
    maxResults?: number;
    includeATP?: boolean;
    includeModa?: boolean;
  }
): Promise<SearchResult[]> {
  const { maxResults = 5 } = options || {};

  const queries = [
    buildKurikulumSearchQuery(subject, phase),
    `Capaian Pembelajaran ${subject} Fase ${phase} Kurikulum Merdeka`,
    `Alur Tujuan Pembelajaran ${subject} Fase ${phase}`,
  ];

  const allResults: SearchResult[] = [];
  const seenUrls = new Set<string>();

  for (const query of queries) {
    if (allResults.length >= maxResults) break;

    const results = await searchDuckDuckGo({ query, maxResults: 3 });

    for (const result of results) {
      if (!seenUrls.has(result.url)) {
        seenUrls.add(result.url);
        allResults.push(result);
      }
    }
  }

  return allResults.slice(0, maxResults);
}

/**
 * Format search results as context string for AI
 */
export function formatSearchContext(results: SearchResult[]): string {
  if (results.length === 0) {
    return '';
  }

  const header = '=== REFERENSI KURIKULUM MERDEKA (Real-time Search) ===\n\n';
  const formatted = results
    .map((result, index) => {
      let text = `[${index + 1}] ${result.title}\n`;
      if (result.snippet) {
        text += `   ${result.snippet}\n`;
      }
      text += `   Sumber: ${result.url}`;
      return text;
    })
    .join('\n\n');

  return header + formatted + '\n\n=== END REFERENSI ===\n\n';
}

// Utility functions for search result handling
export function deduplicateResults(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>();
  return results.filter(result => {
    if (seen.has(result.url)) {
      return false;
    }
    seen.add(result.url);
    return true;
  });
}

export function filterEducationResults(results: SearchResult[]): SearchResult[] {
  const educationDomains = [
    'kemdikbud.go.id',
    'guru.dikbud.id',
    'kemenag.go.id',
    'hasiln belajar.net',
    'zenius.net',
    'ruangguru.com',
    'sekawan.media',
    't了解的.id',
  ];

  return results.filter(result => {
    return educationDomains.some(domain => result.url.includes(domain));
  });
}
