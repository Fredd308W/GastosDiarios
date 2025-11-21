using Google.Cloud.Firestore;
using GastosApi; // Importa el modelo Gasto

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

var app = builder.Build();

// ------------------------------------------------------------------
// CONFIGURACIÓN DE FIRESTORE
// ------------------------------------------------------------------

// Ruta hacia tu archivo JSON dentro de /keys/
string credentialPath = Path.Combine(Directory.GetCurrentDirectory(), "keys", "gastosdiarios-1c9b9-firebase-adminsdk-fbsvc-5b3db9ca34.json");

// Establecer variable de entorno para que Firestore use esa credencial
Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", credentialPath);

// Instancia de Firestore
FirestoreDb db = FirestoreDb.Create("gastosdiarios-1c9b9");


// ------------------------------------------------------------------
// Configure pipeline
// ------------------------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();


// ------------------------------------------------------------------
// GET — Obtener todos los gastos
// ------------------------------------------------------------------
app.MapGet("/api/gastos", async () =>
{
    QuerySnapshot snapshot = await db.Collection("gastos").GetSnapshotAsync();

    var lista = snapshot.Documents.Select(doc =>
    {
        var data = doc.ToDictionary();
        data["id"] = doc.Id; // opcional, si quieres ID
        return data;
    }).ToList();

    return Results.Json(lista);
});


// ------------------------------------------------------------------
// POST — Registrar gasto
// ------------------------------------------------------------------
app.MapPost("/api/gastos", async (Gasto nuevoGasto) =>
{
    await db.Collection("gastos").AddAsync(nuevoGasto);

    return Results.Ok(new { message = "Gasto registrado correctamente" });
});


app.Run();


// ------------------------------------------------------------------
// Weather Forecast (plantilla)
// ------------------------------------------------------------------
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
