using Microsoft.EntityFrameworkCore;
using MyWebApiProject.Data;

var builder = WebApplication.CreateBuilder(args);

// DB
builder.Services.AddDbContext<ScheduleContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();

// CORS (חובה ל-React)
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
app.MapGet("/", () => "API is alive");

// Swagger רק בפיתוח
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
        c.RoutePrefix = string.Empty;
    });
}

// CORS לפני הכל
app.UseRouting();

app.UseCors("AllowAll");

app.UseAuthorization();

// ❗ בפיתוח אפשר להשאיר כבוי כדי למנוע בעיות HTTPS מול React
// app.UseHttpsRedirection();

app.MapControllers();
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ScheduleContext>();

    SeedData.SeedSubjects(db);
    SeedData.SeedGrades(db);
}
app.Run();