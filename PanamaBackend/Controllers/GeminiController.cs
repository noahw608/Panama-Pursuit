using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using PanamaBackend.Data;
using System.Linq;

namespace PanamaBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GeminiController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly AppDbContext _dbContext;

        public GeminiController(IHttpClientFactory httpClientFactory, IConfiguration config, AppDbContext dbContext)
        {
            _httpClient = httpClientFactory.CreateClient();
            _config = config;
            _dbContext = dbContext;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateResponse([FromBody] PromptRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Prompt))
                return BadRequest("Prompt cannot be empty.");

            var apiKey = _config["Gemini:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
                return StatusCode(500, "Gemini API key not configured.");

            var reports = _dbContext.Reports
                .Select(r => new { r.Country, r.Latitude, r.Longitude, r.CreatedAt })
                .ToList();

            var dbStateJson = JsonSerializer.Serialize(reports);

            var combinedPrompt = 
                "You are an expert on the Panama Virus. You have been provided with a database of outbreak locations and exist to analyze the data and provide insight into any questions asked. Only answer questions as raw text, do not format.\n\n" +
                $"Here is the current state of the database: {dbStateJson}\n\nUser prompt: {request.Prompt}";

            var geminiUrl = $"https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key={apiKey}";

            var payload = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = combinedPrompt }
                        }
                    }
                }
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(geminiUrl, content);
            var result = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, result);

            var jsonNode = JsonNode.Parse(result);
            var message = jsonNode?["candidates"]?[0]?["content"]?["parts"]?[0]?["text"]?.ToString();
            return Ok(new { message = message ?? "No response" });
        }
    }

    public class PromptRequest
    {
        public string Prompt { get; set; } = string.Empty;
    }
}