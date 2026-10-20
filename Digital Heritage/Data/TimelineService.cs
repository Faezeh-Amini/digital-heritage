using Digital_Heritage.Models;


namespace Digital_Heritage.Data
{
    public class TimelineService
    {

        private readonly List<TimelineEvent> _events = new()
        {

            new TimelineEvent
            {
                Id="t1",

                Era="Ancient Period",

                Title="Zagros Civilizations",

                Description=
                "The Zagros mountains preserve thousands of years of human settlement, cultural exchange and traditional knowledge.",

                ImageUrl="/images/heritage/bisotun-inscription.jpg"
            },


            new TimelineEvent
            {
                Id="t2",

                Era="Medieval Period",

                Title="Kurdish Principalities",

                Description=
                "Mountain societies developed unique architecture, oral traditions and artistic expressions.",

                ImageUrl="/images/heritage/Hawler_Castle.jpg"
            },


            new TimelineEvent
            {
                Id="t3",

                Era="Modern Era",

                Title="Preserving Kurdish Heritage",

                Description=
                "Digital archives, museums and cultural platforms help protect intangible heritage.",

                ImageUrl="/images/heritage/Dengbej.jpg"
            }

        };



        public Task<List<TimelineEvent>> GetTimelineEventsAsync()
        {
            return Task.FromResult(_events);
        }

    }
}