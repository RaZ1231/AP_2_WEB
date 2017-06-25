namespace AP2_WEB.Migrations
{
    using Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<AP2_WEB.Models.AP2_WEBContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(AP2_WEB.Models.AP2_WEBContext context)
        {

            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data.

            context.Users.AddOrUpdate(x => x.Username,
                new User() { Username = "Raz", Password = "1234", Email = "raz@biu.co.il", Loses = 2, Wins = 5, JoinDate = new DateTime(1992, 7, 6) },
                new User() { Username = "Elish", Password = "1234", Email = "elish@biu.co.il", Loses = 4, Wins = 15, JoinDate = new DateTime(1993, 4, 21) }
            ); context.Users.AddOrUpdate(x => x.Username,
                 new User() { Username = "Raz", Password = "1234", Email = "raz@biu.co.il", Loses = 2, Wins = 5, JoinDate = new DateTime(1992, 7, 6) },
                new User() { Username = "Elish", Password = "1234", Email = "elish@biu.co.il", Loses = 4, Wins = 15, JoinDate = new DateTime(1993, 4, 21) }
             );
        }
    }
}
