using System.Collections.Concurrent;
using System.Net.Sockets;
using System.Text.Json;

namespace Server;

//data of the game
public static class GameData
{
    private static readonly ConcurrentDictionary<int, List<Player>> Sessions = [];
    private static readonly int MAXPLAYERS = 20;

    public static void Initialize()
    {
        Sessions.Clear();
        Sessions.TryAdd(1, []);
    }

    public static int GetSessionId()
    {
        var last = Sessions.Last();
        if (last.Value.Count < MAXPLAYERS)
            return last.Key;

        Sessions.TryAdd(last.Key + 1, []);
        return last.Key + 1;
    }

    public static int GetPlayerId()
    {
        var last = Sessions.Last();
        return last.Value.LastOrDefault()?.Id ?? 0 + 1;
    }

    public static Player CreatePlayer(string name, CharacterType characterType) => CreatePlayer(null, name, characterType);
    public static Player CreatePlayer(int? _sessionId, string name, CharacterType characterType)
    {
        var playerId = GetPlayerId();
        var sessionId = _sessionId ?? GetSessionId();

        var player = new Player
        {
            Id = playerId,
            Name = name,
            SessionId = sessionId,
            CurrentPosition = new(),
            CharacterType = characterType
        };

        AddNewPlayerToSession(player, sessionId);
        return player;
    }

    public static List<Player> GetSessionPlayers(int sessionId) => Sessions.GetValueOrDefault(sessionId) ?? [];

    public static Player? GetPlayerById(int sessionId, int playerId) => Sessions.GetValueOrDefault(sessionId)?.Where(x => x.Id == playerId).FirstOrDefault();

    private static void AddNewPlayerToSession(Player player, int sessionId)
    {
        Sessions.GetValueOrDefault(sessionId)!.Add(player);
    }
}

//basically middleware b/w GameData and direct implementation of sending and receiving data from client
//main logic of the server
public class GameServerManager
{
    public delegate void SessionUpdateHandler(PollResponse pollResponse);
    public static event SessionUpdateHandler? OnSessionUpdate;

    public GameServerManager(HttpRequestHandler connection)
    {
        connection.OnRequest += HandleHttpRequest;
    }

    //does logic based on request type and returns response if has any
    public object? HandleHttpRequest(RequestType requestType, string requestJson)
    {
        if (requestType == RequestType.MOVE)
            HandleMoveRequest(JsonSerializer.Deserialize<MoveRequest>(requestJson, Program.JSON_OPTIONS)!);

        else if (requestType == RequestType.LOGIN)
            return HandleLoginRequestAsync(JsonSerializer.Deserialize<LoginRequest>(requestJson, Program.JSON_OPTIONS)!);

        return null;
    }

    private static LoginResponse HandleLoginRequestAsync(LoginRequest request)
    {
        var player = GameData.CreatePlayer(request.Name, CharacterType.Slug);

        return new LoginResponse
        {
            Name = player.Name,
            PlayerId = player.Id,
            SessionId = player.SessionId
        };
    }

    private static void HandleMoveRequest(MoveRequest request)
    {
        var player = GameData.GetPlayerById(request.SessionId, request.PlayerId);
        if (player == null)
            return;

        player.CurrentPosition = request.NewPos;

        UpdateSession(request.SessionId);
    }

    private static void UpdateSession(int sessionId) 
    {
        var response = HandlePollRequest(sessionId);
        OnSessionUpdate?.Invoke(response);
    }

    private static PollResponse HandlePollRequest(int sessionId)
    {
        var players = GameData.GetSessionPlayers(sessionId);

        var pps = players.Select(x => new ResponsePlayer
        {
            PlayerName = x.Name,
            CharacterType = x.CharacterType,
            PlayerId = x.Id,
            Position = x.CurrentPosition
        }).ToList();

        var response = new PollResponse()
        {
            Players = pps
        };

        return response;
    }
}
