using System.Collections.Generic;

namespace Digital_Heritage.Models
{
    public class MusicItem
    {
        public string Id { get; set; } = string.Empty;

        // Ein Titel kann zu mehreren Kategorien gehören
        // (dengbej, daf, singers, regional, dance, contemporary).
        public List<string> CategoryIds { get; set; } = new();

        public string Title { get; set; } = string.Empty;

        public string ArtistOrStyle { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string AudioUrl { get; set; } = string.Empty;

        public string VideoUrl { get; set; } = string.Empty;

        public string AudioSourceUrl { get; set; } = string.Empty;

        public string AudioCredit { get; set; } = string.Empty;

        public string ImageSourceUrl { get; set; } = string.Empty;

        public string ImageCredit { get; set; } = string.Empty;

        public string VideoSourceUrl { get; set; } = string.Empty;

        public string VideoCredit { get; set; } = string.Empty;

        public string ImageUrl { get; set; } = string.Empty;
    }
}
