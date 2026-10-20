
using Digital_Heritage.Models;
using Digital_Heritage.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Digital_Heritage.Data
{
    public class MusicService
    {
        private readonly List<MusicItem> _musicItems = new()
        {
            // Dengbêj — one card with the original video
            new MusicItem
            {
                Id = "m1",
                CategoryIds = new() { "dengbej" },
                Title = "Dengbêj Epic Stories",
                ArtistOrStyle = "Traditional Oral History",
                Description = "The voices of Dengbêj preserve Kurdish memories, legends and historical narratives through generations.",
                AudioUrl = string.Empty,
                ImageUrl = "/images/heritage/Dengbej.jpg",
                VideoUrl = VideoHelper.ToYouTubeEmbed(
                    "https://youtu.be/2YaAK4Tv0XY") ?? string.Empty
            },

            // Daf — the supplied Daf video
            new MusicItem
            {
                Id = "m2",
                CategoryIds = new() { "daf" },
                Title = "Sanandaj Daf Rhythms",
                ArtistOrStyle = "Traditional Percussion",
                Description = "The Daf drum represents musical and spiritual traditions of Kurdish communities.",
                AudioUrl = string.Empty,
                ImageUrl = "/images/heritage/Hezar daf.webp",
                VideoUrl = VideoHelper.ToYouTubeEmbed(
                    "https://youtu.be/PnsUxgUba9U") ?? string.Empty
            },

            // Singers
            new MusicItem
            {
                Id = "naser-razazi",
                CategoryIds = new() { "singers" },
                Title = "Naser Razazi (Kurdm)",
                ArtistOrStyle = "Singer",
                Description = "Performance by Naser Razazi.",
                VideoUrl = VideoHelper.ToYouTubeEmbed(
                    "https://youtu.be/YzyrjDQ3S4c") ?? string.Empty,
                ImageUrl = "/images/heritage/naser_razazi.jpg"
            },

            new MusicItem
            {
                Id = "sivan-perwer",
                CategoryIds = new() { "singers" },
                Title = "Şivan Perwer",
                ArtistOrStyle = "Singer",
                Description = "Performance by Şivan Perwer.",
                VideoUrl = VideoHelper.ToYouTubeEmbed(
                    "https://youtu.be/1GL3JPxt1bc") ?? string.Empty,
                ImageUrl = "/images/heritage/sivan_perwer.jpg"
            },

            new MusicItem
            {
                Id = "hasan-zirak",
                CategoryIds = new() { "singers" },
                Title = "Hasan Zirak",
                ArtistOrStyle = "Singer",
                Description = "Performance by Hasan Zirak.",
                VideoUrl = VideoHelper.ToYouTubeEmbed(
                    "https://youtu.be/wle2E_d4Zx8") ?? string.Empty,
                ImageUrl = "/images/heritage/Hesen_Zirek_Commons.jpg"
            },

            new MusicItem
            {
                Id = "maryam-xan",
                CategoryIds = new() { "singers" },
                Title = "Maryam Xan",
                ArtistOrStyle = "Singer",
                Description = "Performance by Maryam Xan.",
                VideoUrl = VideoHelper.ToYouTubeEmbed(
                    "https://youtu.be/YujSZaSRMO8") ?? string.Empty,
                ImageUrl = "/images/heritage/maryam_xan.jpg"
            },

            // Regional music — keep all regional styles
            new MusicItem
            {
                Id = "dueti-kelhuri",
                CategoryIds = new() { "regional" },
                Title = "Dueti Kelhuri",
                ArtistOrStyle = "Regional duet",
                Description = "Kelhuri duet performance.",
                VideoUrl = VideoHelper.ToYouTubeEmbed(
                    "https://youtu.be/r7pSNLLX4Rc") ?? string.Empty,
                ImageUrl = "/images/heritage/kelhuri_duet.jpg"
            },

            new MusicItem
            {
                Id = "kurmanji-music",
                CategoryIds = new() { "regional" },
                Title = "Kurmanji Music",
                ArtistOrStyle = "Regional style",
                Description = "Examples of Kurmanji music.",
                VideoUrl = VideoHelper.ToYouTubeEmbed(
                    "https://youtu.be/H0gbGzmMIq0") ?? string.Empty,
                ImageUrl = "/images/heritage/kurmanji_music.jpg"
            },

            new MusicItem
            {
                Id = "hawrami-music",
                CategoryIds = new() { "regional" },
                Title = "Hawrami Music",
                ArtistOrStyle = "Regional style",
                Description = "Hawrami music examples.",
                VideoUrl = VideoHelper.ToYouTubeEmbed(
                    "https://youtu.be/_p8-39zpwnQ") ?? string.Empty,
                ImageUrl = "/images/heritage/Hawraman.jpg"
            },

            // Contemporary music
            new MusicItem
            {
                Id = "bo-kurdistan-1",
                CategoryIds = new() { "contemporary" },
                Title = "Bo Kurdistan (1)",
                ArtistOrStyle = "Identity",
                Description = "Bo Kurdistan video.",
                VideoUrl = VideoHelper.ToYouTubeEmbed(
                    "https://youtu.be/UMRfoQDXxhE") ?? string.Empty,
                VideoSourceUrl = "https://youtu.be/7p7hp6WbBQU",
                ImageUrl = "/images/heritage/bo_kurdistan.jpg"
            },

            new MusicItem
            {
                Id = "peshmerga",
                CategoryIds = new() { "contemporary" },
                Title = "Peshmerga",
                ArtistOrStyle = "Contemporary",
                Description = "Peshmerga-related video.",
                VideoUrl = VideoHelper.ToYouTubeEmbed(
                    "https://youtu.be/W2G7NiUS1vU") ?? string.Empty,
                ImageUrl = "/images/heritage/peshmerga.jpg"
            },

            new MusicItem
            {
                Id = "dilan",
                CategoryIds = new() { "dance" },
                Title = "Dilan (Dance & Music)",
                ArtistOrStyle = "Dance & Music",
                Description = "Dilan performance.",
                VideoUrl = VideoHelper.ToYouTubeEmbed(
                    "https://youtu.be/G-PAjHbYgSw") ?? string.Empty,
                ImageUrl = "/images/heritage/dilan.jpg"
            },

            new MusicItem
            {
                Id = "jin-jiyan-azadi",
                CategoryIds = new() { "contemporary" },
                Title = "Jin Jiyan Azadî (feat. Nesrin Botan, Somayeh Mohammad, Caziya Genço)",
                ArtistOrStyle = "Contemporary",
                Description = "Jin Jiyan Azadî performance.",
                VideoUrl = VideoHelper.ToYouTubeEmbed(
                    "https://youtu.be/L3188tWdynY") ?? string.Empty,
                ImageUrl = "/images/heritage/jin_jiyan_azadi.jpg"
            },

            new MusicItem
            {
                Id = "har-kurdin",
                CategoryIds = new() { "contemporary" },
                Title = "Har Kurdin w Har Kurd Abin",
                ArtistOrStyle = "Identity",
                Description = "Identity song.",
                VideoUrl = VideoHelper.ToYouTubeEmbed(
                    "https://youtu.be/DYQ4wReivFI") ?? string.Empty,
                ImageUrl = "/images/heritage/har_kurdin.jpg"
            },

            new MusicItem
            {
                Id = "kurdm-new",
                CategoryIds = new() { "contemporary" },
                Title = "Kurdm (New groups/works)",
                ArtistOrStyle = "Contemporary",
                Description = "New Kurdish works.",
                VideoUrl = VideoHelper.ToYouTubeEmbed(
                    "https://youtu.be/6YGWkFWHaSM") ?? string.Empty,
                ImageUrl = "/images/heritage/kurdm_new.jpg"
            },

            new MusicItem
            {
                Id = "hunergeha-servano",
                CategoryIds = new() { "contemporary" },
                Title = "Hunergeha Welat - Şervano",
                ArtistOrStyle = "Performance",
                Description = "Hunergeha Welat performance by Şervano.",
                VideoUrl = VideoHelper.ToYouTubeEmbed(
                    "https://youtu.be/_QZkWVCk9Zs") ?? string.Empty,
                ImageUrl = "/images/heritage/servano.jpg"
            }
        };

        public Task<List<MusicItem>> GetMusicItemsAsync()
        {
            return Task.FromResult(_musicItems);
        }
    }
}
