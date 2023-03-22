using LeagueProspects.Models;
using Microsoft.EntityFrameworkCore;
using LeagueProspects.Services;

var builder = WebApplication.CreateBuilder(args);


builder.Services.Configure<ProspectDatabaseSettings>(
    builder.Configuration.GetSection("ProspectDatabase"));

builder.Services.AddSingleton<MongoProspectsServices>();

// Add services to the container.
builder.Services.AddControllersWithViews();
//builder.Services.AddDbContext<ProspectsContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("ProspectsContext")));

//builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

