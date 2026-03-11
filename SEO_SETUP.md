# SEO Setup Instructions

## Files Created

1. **robots.txt** - Located in `/public/robots.txt`
2. **sitemap.xml** - Located in `/public/sitemap.xml`

## Before Deployment

### 1. Update Domain in robots.txt
Replace `https://yourdomain.com` with your actual domain in:
- Line 10: `Sitemap: https://yourdomain.com/sitemap.xml`

### 2. Update Domain in sitemap.xml
Replace `https://yourdomain.com` with your actual domain in:
- All `<loc>` tags

### 3. Update Last Modified Dates
Update the `<lastmod>` dates in sitemap.xml to reflect when you last updated each page.

## How It Works

### robots.txt
- Allows all search engine crawlers to access your site
- Points crawlers to your sitemap location
- Can be extended to disallow specific paths if needed

### sitemap.xml
- Lists all important pages for search engines
- Includes priority and change frequency hints
- Helps search engines discover and index your content

## Testing

After deployment, verify the files are accessible:
- `https://yourdomain.com/robots.txt`
- `https://yourdomain.com/sitemap.xml`

## Submitting to Search Engines

1. **Google Search Console**: Submit your sitemap at https://search.google.com/search-console
2. **Bing Webmaster Tools**: Submit at https://www.bing.com/webmasters

## Notes

- Vite automatically serves files from the `public` folder at the root URL
- These files will be available at `/robots.txt` and `/sitemap.xml` after build
- Update the sitemap whenever you add new pages or make significant content changes

