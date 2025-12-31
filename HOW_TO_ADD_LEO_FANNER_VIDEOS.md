# How to Add Leo Fanner's YouTube Videos to Your Portfolio

## Quick Guide

Follow these simple steps to add all long-form videos from Leo Fanner's channel to your fitness section:

### Step 1: Visit the YouTube Channel
Go to: https://www.youtube.com/@leofanner/videos

### Step 2: Get Video Information

For each long-form fitness video, you'll need:
1. **Video Title** - The name of the video
2. **YouTube Video ID** - Found in the URL

#### How to Get the YouTube Video ID:
- Click on a video
- Look at the URL in your browser: `https://www.youtube.com/watch?v=ABC123XYZ`
- The Video ID is the part after `v=` → `ABC123XYZ`

### Step 3: Add Videos to Your Portfolio

Open `data/portfolio.ts` and find the "LEO FANNER FITNESS VIDEOS" section (around line 86).

Replace the template entries with real data:

```typescript
{
  id: 100,  // Increment this for each video (100, 101, 102, etc.)
  title: "Actual Video Title Here",  // Copy from YouTube
  category: "Fitness",
  type: "Long Form",
  video: "",
  thumbnail: "https://img.youtube.com/vi/VIDEO_ID_HERE/maxresdefault.jpg",
  isYouTube: true,
  youtubeId: "VIDEO_ID_HERE",  // Paste the YouTube ID
},
```

### Step 4: Example with Real Video

Let's say you found this video:
- **URL**: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- **Title**: "10 Min Upper Body Workout"
- **Video ID**: `dQw4w9WgXcQ`

Add it like this:

```typescript
{
  id: 100,
  title: "10 Min Upper Body Workout",
  category: "Fitness",
  type: "Long Form",
  video: "",
  thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  isYouTube: true,
  youtubeId: "dQw4w9WgXcQ",
},
```

### Step 5: Add More Videos

Just copy-paste the template and fill in new information for each video:
- Increment the `id` (101, 102, 103, etc.)
- Update the `title`
- Update the `youtubeId` in TWO places (thumbnail URL and youtubeId field)

### Step 6: Save and Check

1. Save `data/portfolio.ts`
2. The dev server will auto-reload
3. Visit your website and click on "Fitness" or "Long Form" filter
4. Click on any Leo Fanner video to watch it!

## Features You Get:

✅ **YouTube Thumbnails**: Automatically loaded from YouTube
✅ **Embedded Player**: Videos play directly in your modal
✅ **Filterable**: Videos appear in both "Fitness" and "Long Form" filters
✅ **Professional Look**: Same beautiful interface as your other portfolio items

## Thumbnail Quality Options:

You can use different thumbnail qualities:
- `maxresdefault.jpg` - Highest quality (1920x1080)
- `sddefault.jpg` - Standard quality (640x480)
- `hqdefault.jpg` - High quality (480x360)
- `mqdefault.jpg` - Medium quality (320x180)

The template uses `maxresdefault.jpg` for best quality.

## Need Help?

If you have any questions or need assistance, check the comments in `data/portfolio.ts` for more guidance!

---

**Happy Building! 🎬**

