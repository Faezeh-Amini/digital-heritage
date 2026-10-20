using System;
using System.Text.RegularExpressions;

namespace Digital_Heritage.Utilities
{
    public static class VideoHelper
    {
        // Convert various YouTube URL forms to an embed URL (https://www.youtube.com/embed/{id})
        public static string? ToYouTubeEmbed(string? url)
        {
            if (string.IsNullOrWhiteSpace(url))
                return null;

            var u = url.Trim();

            // If already embed, return normalized
            if (u.Contains("youtube.com/embed/", StringComparison.OrdinalIgnoreCase))
            {
                return NormalizeEmbed(u);
            }

            try
            {
                // match youtu.be/<id>
                var m = Regex.Match(u, @"youtu\.be\/([A-Za-z0-9_-]{4,})");
                if (m.Success)
                {
                    return MakeEmbed(m.Groups[1].Value);
                }

                // match youtube.com/watch?v=<id>
                m = Regex.Match(u, @"[?&]v=([A-Za-z0-9_-]{4,})");
                if (m.Success)
                {
                    return MakeEmbed(m.Groups[1].Value);
                }

                // match youtube.com/shorts/<id>
                m = Regex.Match(u, @"youtube\.com\/shorts\/([A-Za-z0-9_-]{4,})");
                if (m.Success)
                {
                    return MakeEmbed(m.Groups[1].Value);
                }

                // match any /watch/ or other patterns with an id at the end
                m = Regex.Match(u, @"([A-Za-z0-9_-]{11})(?:$|[&?])");
                if (m.Success)
                {
                    return MakeEmbed(m.Groups[1].Value);
                }

            }
            catch { }

            return null;
        }

        private static string MakeEmbed(string id)
        {
            return $"https://www.youtube.com/embed/{id}";
        }

        private static string NormalizeEmbed(string url)
        {
            // try to extract id
            var m = Regex.Match(url, @"embed\/([A-Za-z0-9_-]{4,})");
            if (m.Success)
                return MakeEmbed(m.Groups[1].Value);
            return url;
        }
    }
}
