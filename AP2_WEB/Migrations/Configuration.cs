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
                new User() { Username = "test1", Password = "1234", Email = "test1@gmail.com", Loses = 12, Wins = 7, JoinDate = new DateTime(2008, 4, 1) },
                new User() { Username = "test2", Password = "1234", Email = "test2@gmail.com", Loses = 4, Wins = 15, JoinDate = new DateTime(1992, 7, 6) },
                new User() { Username = "test3", Password = "1234", Email = "test3@gmail.com", Loses = 5, Wins = 16, JoinDate = new DateTime(2011, 2, 28) }
            ); context.Users.AddOrUpdate(x => x.Username,
                 new User() { Username = "test1", Password = "1234", Email = "test1@gmail.com", Loses = 12, Wins = 7, JoinDate = new DateTime(2008, 4, 1) },
                 new User() { Username = "test2", Password = "1234", Email = "test2@gmail.com", Loses = 4, Wins = 15, JoinDate = new DateTime(1992, 7, 6) },
                 new User() { Username = "test3", Password = "1234", Email = "test3@gmail.com", Loses = 5, Wins = 16, JoinDate = new DateTime(2011, 2, 28) }
             );
        }
    }
}
