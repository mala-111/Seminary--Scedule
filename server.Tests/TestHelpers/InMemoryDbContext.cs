using Microsoft.EntityFrameworkCore;
using MyWebApiProject.Data;

public static class InMemoryDbContext
{
    public static ScheduleContext GetContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<ScheduleContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;

        return new ScheduleContext(options);
    }
}