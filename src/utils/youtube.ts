const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube-nocookie\.com\/embed\/)([\w-]{11})/i,
  /youtube\.com\/embed\/([\w-]{11})/i,
  /youtube\.com\/shorts\/([\w-]{11})/i,
];

export function extractYouTubeId(source: string): string | undefined {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = source.match(pattern);
    if (match?.[1]) return match[1];
  }
  return undefined;
}

export function youtubeThumbnail(videoId: string, quality: 'maxresdefault' | 'hqdefault' = 'maxresdefault') {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}
