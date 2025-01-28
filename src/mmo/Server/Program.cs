using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Server;

public enum RequestType
{
    LOGIN, MOVE, POLL
}

public enum CharacterType
{
    Slug
}

public class Vector2d
{
    public double x { get; set; }
    public double y { get; set; }
}

public class Player
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int SessionId { get; set; }
    public Vector2d CurrentPosition { get; set; } = new();
    public CharacterType CharacterType { get; set; }
}

public class Request
{
    public required RequestType REQUEST { get; set; }
}

public class LoginRequest : Request
{
    [JsonPropertyName("name")]
    public required string Name { set; get; }
}

public class MoveRequest : Request
{
    public int PlayerId { get; set; }
    public int SessionId { get; set; }
    public Vector2d NewPos { get; set; } = new();
}

public class PollResponse
{
    public List<ResponsePlayer> Players { get; set; } = [];
    public List<Chat> Chat { get; set; } = [];
}

public class PollRequest
{
    public int SessionId { get; set; }
}

public class ResponsePlayer
{
    public CharacterType CharacterType { get; set; }
    public required string PlayerName { get; set; }
    public int PlayerId { get; set; }
    public Vector2d Position { get; set; }
}

public class Chat
{
    public int PlayerId { get; set; }
    public required string Text { get; set; }
}

public class LoginResponse
{
    public int PlayerId { get; set; }
    public int SessionId { get; set; }
    public required string Name { set; get; }
}

public class Program
{
    private static readonly int PORT = 8081;
    private static readonly string ServerAddress = "127.0.0.1";

    public static readonly JsonSerializerOptions JSON_OPTIONS = new()
    {
        Converters = { new JsonStringEnumConverter() },
        NumberHandling = JsonNumberHandling.AllowNamedFloatingPointLiterals,
    };

    public static void Main()
    {
        GameData.Initialize();
        var ip = IPAddress.Parse(ServerAddress);
        using TcpListener listener = new(ip, PORT);
        listener.Start(20);
        ConnectionLoop(listener);
    }

    private static void ConnectionLoop(TcpListener listener)
    {
        while (true)
        {
            var client = listener.AcceptTcpClient();
            Console.WriteLine($"New client connected");

            _ = Task.Run(() =>
            {
                using var stream = client.GetStream();
                using var reader = new StreamReader(stream, Encoding.UTF8);

                // Read the HTTP request headers

                var buffer = new byte[4096];
                var bytesRead = reader.BaseStream.Read(buffer, 0, buffer.Length);
                var requestHeaders = Encoding.UTF8.GetString(buffer, 0, bytesRead);

                Console.WriteLine($"gg: {requestHeaders}");

                // Check if this is an SSE request
                if (requestHeaders.Contains("Accept: text/event-stream") || requestHeaders.Contains("GET /sse"))
                {
                    Console.WriteLine("SSE request detected. Starting SSE handler.");
                    var handler = new SSERequestHandler(client, stream, requestHeaders);
                    handler.Handle(); // Call the SSE handler
                }
                else
                {
                    Console.WriteLine("Regular HTTP request detected.");
                    var handler = new HttpRequestHandler(client, stream, requestHeaders);
                    var gameManager = new GameServerManager(handler);

                    handler.Handle(); // Call the handler
                }
            });
        }
    }

}
