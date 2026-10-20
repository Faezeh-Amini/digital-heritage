using System;

namespace Digital_Heritage.Utilities
{
    public static class ImagePathHelper
    {
        public static string? NormalizePath(string? path)
        {
            if (string.IsNullOrWhiteSpace(path))
                return path;

            var p = path.Trim();

            // If already a proper root-relative images path, return as-is
            if (p.StartsWith("/images/", StringComparison.OrdinalIgnoreCase))
                return p.Replace('\\', '/');

            // If starts with '/' but not /images/, convert to /images/heritage/<filename>
            try
            {
                string fileName = System.IO.Path.GetFileName(Uri.UnescapeDataString(p).Replace('\\', '/')) ?? string.Empty;
                if (string.IsNullOrWhiteSpace(fileName))
                    return "/images/heritage/"; // fallback

                // Ensure the filename is URL-encoded for safe usage in HTML
                var encoded = Uri.EscapeDataString(fileName);
                return "/images/heritage/" + encoded;
            }
            catch
            {
                // On any error, fallback to a safe root-relative path
                return "/images/heritage/" + Uri.EscapeDataString(p.Replace('\\', '/').TrimStart('.','/'));
            }
        }
    }
}
