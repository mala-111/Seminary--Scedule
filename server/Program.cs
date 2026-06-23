using Microsoft.EntityFrameworkCore;
using MyWebApiProject.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;


var builder = WebApplication.CreateBuilder(args);

// ====================
// Configure DB Context
// ====================
builder.Services.AddDbContext<ScheduleContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ====================
// Add Controllers
// ====================
builder.Services.AddControllers();

// ====================
// Swagger / OpenAPI
// ====================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();

// ====================
// Set URL for Docker
// ====================
builder.WebHost.UseUrls("http://0.0.0.0:8080");

// ====================
// CORS for React
// ====================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// ====================
// Root Endpoint
// ====================
app.MapGet("/", () => "API is alive");

// ====================
// Swagger only in Development
// ====================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
        c.RoutePrefix = "swagger";
    });
}

// ====================
// Middleware
// ====================
app.UseRouting();
app.UseCors("AllowAll");
app.UseAuthorization();

// ====================
// Map Controllers
// ====================
app.MapControllers();


// ====================
// Apply Migrations + Seed Data
// ====================
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ScheduleContext>();

    try
    {
        // רק מריץ מיגרציות קיימות
        for (int i = 0; i < 10; i++)
{
    try
    {
        db.Database.Migrate();
        break;
    }
    catch
    {
        Thread.Sleep(3000);
    }
}

        // Seed רק אם אין נתונים
        if (!db.Subjects.Any())
            SeedData.SeedSubjects(db);

        if (!db.Grades.Any())
            SeedData.SeedGrades(db);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ DB init failed: {ex.Message}");
        throw; // עוצר אם משהו משתבש
    }
}

// ====================
// Run the App
// ====================
app.Run();