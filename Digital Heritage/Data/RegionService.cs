using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Digital_Heritage.Models;

namespace Digital_Heritage.Data
{
    public class RegionService
    {
        private readonly List<Region> regions = new()
        {
            new Region
            {
                Id = "hawraman",
                Name = "Hawraman Cultural Landscape",
                Description = "Ancient mountain villages, stone architecture and traditional Kurdish lifestyle.",
                Category = "Architecture",
                ImageUrl = "/images/heritage/Hawraman.jpg",
                VideoUrl = string.Empty,
                AudioUrl = string.Empty
            },

            new Region
            {
                Id = "hawler",
                Name = "Hawler Erbil",
                Description = "Historic citadel and one of the oldest continuously inhabited cities.",
                Category = "History",
                ImageUrl = "/images/heritage/Hawler_Castle.jpg",
                VideoUrl = string.Empty,
                AudioUrl = string.Empty
            },

            new Region
            {
                Id = "sanandaj",
                Name = "Sanandaj",
                Description = "Center of Kurdish music, carpets and traditional craftsmanship.",
                Category = "Music",
                ImageUrl = "/images/heritage/Sanandaj_from_Abidar.jpg",
                VideoUrl = Digital_Heritage.Utilities.VideoHelper.ToYouTubeEmbed("https://youtu.be/H0gbGzmMIq0") ?? string.Empty,
                AudioUrl = string.Empty
            },
            new Region
            {
                Id = "kermanshah",
                Name = "Kermanshah",
                Description = "Kermanshah cultural area and Kelhuri traditions.",
                Category = "Regional",
                ImageUrl = "/images/heritage/Kermanshah.jpg",
                VideoUrl = Digital_Heritage.Utilities.VideoHelper.ToYouTubeEmbed("https://youtu.be/r7pSNLLX4Rc") ?? string.Empty,
                AudioUrl = string.Empty
            }
        };


        public Task<List<Region>> GetRegionsAsync()
        {
            return Task.FromResult(regions);
        }


        public Task<Region?> GetRegionByIdAsync(string id)
        {
            var result = regions.FirstOrDefault(
                x => x.Id.Equals(id, StringComparison.OrdinalIgnoreCase)
            );

            return Task.FromResult(result);
        }
    }
}