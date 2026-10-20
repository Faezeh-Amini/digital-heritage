using Digital_Heritage.Models;


namespace Digital_Heritage.Data
{
    public class CraftService
    {

        private readonly List<CraftItem> _craftItems = new()
        {

            new CraftItem
            {
                Id="c1",

                Name="Sine Carpet Geometry",

                Category="Carpet Weaving",

                Description=
                "Complex geometric patterns inspired by nature, history and Zagros culture.",

                ImageUrl="/images/heritage/hawler.carpet.jfif"
            },


            new CraftItem
            {
                Id="c2",

                Name="Traditional Kurdish Clothing",

                Category="Traditional clothing",

                Description=
                "Traditional Kurdish dress and textile craftsmanship, represented by a local garment image.",

                ImageUrl="/images/heritage/Jli%20Kurdi.jpg"
            }


        };



        public Task<List<CraftItem>> GetCraftItemsAsync()
        {
            return Task.FromResult(_craftItems);
        }


    }
}