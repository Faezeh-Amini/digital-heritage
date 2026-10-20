using System.Text.Json;
using Digital_Heritage.Models;

namespace Digital_Heritage.Data
{
    public class GalleryService
    {
        private readonly IWebHostEnvironment _environment;

        public GalleryService(IWebHostEnvironment environment) => _environment = environment;

        public async Task<List<GalleryItem>> GetGalleryItemsAsync()
        {
            var items = new List<GalleryItem>();
            var usedFiles = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var webRoot = _environment.WebRootPath;
            var cityDataPath = Path.Combine(webRoot, "data", "cities.json");

            if (File.Exists(cityDataPath))
            {
                using var document = JsonDocument.Parse(await File.ReadAllTextAsync(cityDataPath));
                foreach (var city in document.RootElement.EnumerateArray())
                {
                    var cityName = ReadString(city, "name") ?? "Cultural place";
                    if (!city.TryGetProperty("gallery", out var gallery) || gallery.ValueKind != JsonValueKind.Array)
                        continue;

                    var index = 0;
                    foreach (var photo in gallery.EnumerateArray())
                    {
                    var imageUrl = ReadString(photo, "src")?.Trim();
                    if (string.IsNullOrWhiteSpace(imageUrl))
                        continue;

                    // Normalize JSON-provided paths to root-relative form.
                    if (!imageUrl.StartsWith("/"))
                    {
                        // remove leading ./ or ../ and ensure forward slashes
                        imageUrl = "/" + imageUrl.TrimStart('.', '/', '\\').Replace('\\', '/');
                    }

                    // Only accept images served from /images/ to avoid external or invalid paths
                    if (!imageUrl.StartsWith("/images/", StringComparison.OrdinalIgnoreCase))
                        continue;

                    var physicalPath = ResolveImagePath(webRoot, imageUrl);
                        if (physicalPath is null || !File.Exists(physicalPath) || !usedFiles.Add(physicalPath))
                            continue;

                    var credit = string.Join(" · ", new[] { ReadString(photo, "creator"), ReadString(photo, "license") }.Where(value => !string.IsNullOrWhiteSpace(value)));

                    // Filter Wikimedia media links except for allowed city IDs.
                    var rawSource = ReadString(photo, "sourceUrl")?.Trim();
                    string finalSource = string.Empty;
                    if (!string.IsNullOrEmpty(rawSource))
                    {
                        var lower = rawSource.ToLowerInvariant();
                        var isWikimedia = lower.Contains("wikimedia.org") || lower.Contains("upload.wikimedia.org") || lower.Contains("commons.wikimedia.org");
                        var cityId = ReadString(city, "id")?.Trim().ToLowerInvariant() ?? string.Empty;
                        // Allow wikimedia only for Sanandaj and Kermanshah (ids: "sanandaj", "kermanshah").
                        if (!isWikimedia || cityId == "sanandaj" || cityId == "kermanshah")
                        {
                            finalSource = rawSource;
                        }
                    }

                    items.Add(new GalleryItem
                    {
                        Id = $"city-{ReadString(city, "id")}-{index++}",
                        Title = ReadString(photo, "caption") ?? cityName,
                        Category = "Cities & cultural places",
                        Description = string.IsNullOrWhiteSpace(credit) ? "Project image · photo credit and reuse terms to confirm." : credit,
                        ImageUrl = imageUrl,
                        SourceUrl = finalSource
                    });
                    }
                }
            }

            var imageRoot = Path.Combine(webRoot, "images", "heritage");
            var extensions = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { ".jpg", ".jpeg", ".png", ".webp", ".jfif", ".gif" };
            var excludedFolders = new[] { "_files", "Google Suche_files" };
            if (Directory.Exists(imageRoot))
            {
                foreach (var filePath in Directory.EnumerateFiles(imageRoot, "*", SearchOption.AllDirectories).OrderBy(path => path, StringComparer.OrdinalIgnoreCase))
                {
                    var relative = Path.GetRelativePath(imageRoot, filePath);
                    if (!extensions.Contains(Path.GetExtension(filePath)) || relative.Split(Path.DirectorySeparatorChar).Any(part => excludedFolders.Any(excluded => part.Contains(excluded, StringComparison.OrdinalIgnoreCase))))
                        continue;
                    if (Path.GetFileName(filePath).StartsWith("Halabja", StringComparison.OrdinalIgnoreCase))
                        continue;
                    if (!usedFiles.Add(Path.GetFullPath(filePath)))
                        continue;

                    var folder = Path.GetDirectoryName(relative) ?? string.Empty;
                    var imageUrl = "/images/heritage/" + string.Join("/", relative.Split(Path.DirectorySeparatorChar).Select(Uri.EscapeDataString));
                    var category = GetCulturalCategory(folder, Path.GetFileName(filePath));
                    items.Add(new GalleryItem
                    {
                        Id = "collection-" + Convert.ToHexString(System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(relative)))[..12],
                        Title = Path.GetFileNameWithoutExtension(filePath).Replace('_', ' ').Replace('#', ' '),
                        Category = category,
                        Description = "Image from the project's topic folder · exact caption, creator and reuse terms should be confirmed.",
                        ImageUrl = imageUrl
                    });
                }
            }

            return items;
        }

        private static string? ResolveImagePath(string webRoot, string imageUrl)
        {
            try
            {
                var relative = Uri.UnescapeDataString(imageUrl.TrimStart('/')).Replace('/', Path.DirectorySeparatorChar);
                return Path.GetFullPath(Path.Combine(webRoot, relative));
            }
            catch (UriFormatException) { return null; }
        }

        private static string? ReadString(JsonElement element, string name) =>
            element.TryGetProperty(name, out var value) && value.ValueKind == JsonValueKind.String ? value.GetString() : null;

        private static string GetCulturalCategory(string folder, string fileName)
        {
            var key = (folder + " " + fileName).ToLowerInvariant();
            if (key.Contains("zamawan") || key.Contains("wedding") || key.Contains("hafla") || key.Contains("arus")) return "Weddings & Zawaman";
            if (key.Contains("dengbej") || key.Contains("musik") || key.Contains("daf") || key.Contains("halparke") || key.Contains("tanz") || key.Contains("dance")) return "Music & dance";
            if (key.Contains("deq") || key.Contains("tattoo")) return "Deq & body art";
            if (key.Contains("food") || key.Contains("hanar") || key.Contains("pomegranate") || key.Contains("anar") || key.Contains("kalana") || key.Contains("danakollana")) return key.Contains("food") || key.Contains("kalana") || key.Contains("danakollana") ? "Kurdish food" : "Harvest & pomegranate festivals";
            if (key.Contains("akre") || key.Contains("newroz") || key.Contains("nowruz") || key.Contains("newruz")) return "Newroz & spring celebrations";
            if (key.Contains("pirshalyar") || key.Contains("pir shalyar")) return "Pîr Şalyar ceremony";
            if (key.Contains("handkraft") || key.Contains("craft") || key.Contains("carpet") || key.Contains("khash") || key.Contains("tashi")) return "Handicrafts & weaving";
            if (key.Contains("jlikurdi") || key.Contains("clothing") || key.Contains("costume") || key.Contains("attire") || key.Contains("jli kurdi")) return "Kurdish clothing";
            if (key.Contains("jin jiyan") || key.Contains("jina amini") || key.Contains("kobani") || key.Contains("kezi")) return "Jin, Jiyan, Azadî & contemporary memory";
            if (key.Contains("sun") || key.Contains("symbol")) return "Symbols & identity";
            if (key.Contains("food")) return "Kurdish food";
            return "Regional places & heritage";
        }
    }
}
