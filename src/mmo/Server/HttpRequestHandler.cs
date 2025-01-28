using System.Net.Sockets;
using System.Text;
using System.Text.Json;

namespace Server;

public class SSERequestHandler(TcpClient _client, NetworkStream stream, string request) : IDisposable
{
    public void Dispose()
    {
        _client.Dispose();
        GC.SuppressFinalize(this);
    }

    private Socket ClientSocket = null!;

    public void Handle()
    {
        Console.WriteLine("Thread created and started");

        TcpClient client = _client;
        ClientSocket = client.Client;
        GameServerManager.OnSessionUpdate += SendPollResponse;

        try
        {
            SendAckResponse(stream);
            while (client.Connected)
            {
                try
                {

                    // Optional: Add a delay to control the frequency of events
                    Thread.Sleep(500); // Send an event every second

                    // Check if the client is still connected
                    if (ClientSocket.Poll(1000, SelectMode.SelectRead) && ClientSocket.Available == 0)
                    {
                        Console.WriteLine("Client disconnected gracefully.");
                        break;
                    }

                }
                catch (SocketException ex)
                {
                    Console.WriteLine($"The client disconnected abruptly: {ex.Message}");
                    break;
                }
                catch (IOException ex)
                {
                    Console.WriteLine($"Network stream error: {ex.Message}");
                    break;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Client handling error: {ex.Message}\nStackTr: {ex.StackTrace}");
                }
            }
        }
        finally
        {
            client.Close();
            Console.WriteLine("Client connection closed.");
        }

        Console.WriteLine("Thread ended");
    }


    private void SendPollResponse(PollResponse response)
    {
        Console.WriteLine("sending event response");

        var responseHeaders = "HTTP/1.1 200 OK\r\nContent-Type: text/event-stream\r\nAccess-Control-Allow-Origin:*\r\nAccess-Control-Allow-Methods:POST, OPTIONS, GET\r\n\r\n";
        var responseBody = $"data: {JsonSerializer.Serialize(response, Program.JSON_OPTIONS)}";
        var responseString = String.Concat(responseHeaders, responseBody);

        ClientSocket.Send(ASCIIEncoding.UTF8.GetBytes(responseString));
    }

    private void SendAckResponse(NetworkStream? stream = null)
    {
        var responseHeaders = HttpRequestHandler.GetResponseHeaders("HTTP/1.1 204 No Content");

        if (stream == null)
            ClientSocket.Send(ASCIIEncoding.UTF8.GetBytes(responseHeaders));
        else
            stream.Write(ASCIIEncoding.UTF8.GetBytes(responseHeaders));
    }
}

public class HttpRequestHandler(TcpClient _client, NetworkStream stream, string request) : IDisposable
{
    public delegate object? HandleGameRequest(RequestType requestType, string requestJson);
    public event HandleGameRequest? OnRequest;

    private Socket ClientSocket = null!;

    public void Handle()
    {
        Console.WriteLine("thread created and started");

        //consuming the socket established by client
        TcpClient client = _client;
        ClientSocket = client.Client;
        _client.ReceiveTimeout = 5000;

        try
        {
            Console.WriteLine($"Received: {request}");

            HandleRequest(request, stream);

        }
        catch (SocketException ex)
        {
            Console.WriteLine($"The client disconnected abruptly: {ex.Message}");
            SendBadRequestResponse(stream);
        }
        catch (IOException ex)
        {
            Console.WriteLine($"Network stream error: {ex.Message}");
            SendBadRequestResponse(stream);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Client handling error: {ex.Message}\nStackTr: {ex.StackTrace}");
            SendBadRequestResponse(stream);
        }

        finally
        {
            client.Close();
            client.Dispose();
            Console.WriteLine("Client connection closed.");
        }

        Console.WriteLine("thread ended");
    }

    private void HandleRequest(string httpRequest, NetworkStream stream)
    {
        if (IsOptionsRequest(httpRequest))
        {
            SendAckResponse(stream);
            return;
        }

        var requestJson = GetJsonFromBody(httpRequest);
        if (requestJson == null)
        {
            SendRetryResponse(stream);
            return;
        }

        var request = JsonSerializer.Deserialize<Request>(requestJson, Program.JSON_OPTIONS)!;

        var response = OnRequest?.Invoke(request.REQUEST, requestJson);

        if (response != null)
            SendResponse(response, stream);

        else
            SendAckResponse();
    }

    private static bool IsOptionsRequest(string req)
    {
        return req.Split('\n').First().Contains("OPTIONS");
    }

    private static string? GetJsonFromBody(string req)
    {
        var index = req.IndexOf('{');
        if (index == -1)
            return null;

        return req.Substring(req.IndexOf('{'));
    }

    private void SendResponse(object? response, NetworkStream stream)
    {
        var responseHeaders = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nAccess-Control-Allow-Origin:*\r\nAccess-Control-Allow-Methods:POST, OPTIONS, GET\r\n\r\n";
        var responseBody = JsonSerializer.Serialize(response, Program.JSON_OPTIONS);
        var responseString = String.Concat(responseHeaders, responseBody);

        stream.Write(ASCIIEncoding.UTF8.GetBytes(responseString));
    }

    private void SendAckResponse(NetworkStream? stream = null)
    {
        var responseHeaders = GetResponseHeaders("HTTP/1.1 204 No Content");

        if (stream == null)
            ClientSocket.Send(ASCIIEncoding.UTF8.GetBytes(responseHeaders));
        else
            stream.Write(ASCIIEncoding.UTF8.GetBytes(responseHeaders));
    }

    private void SendBadRequestResponse(NetworkStream stream)
    {
        var responseHeaders = GetResponseHeaders("HTTP/1.1 400 Bad Request");

        stream.Write(ASCIIEncoding.UTF8.GetBytes(responseHeaders));
    }

    private void SendRetryResponse(NetworkStream stream)
    {
        var responseHeaders = GetResponseHeaders("HTTP/1.1 408 Request Timeout");

        stream.Write(ASCIIEncoding.UTF8.GetBytes(responseHeaders));
    }

    public static string GetResponseHeaders(string firstLine) =>
        $"{firstLine}\r\n" +
        $"Access-Control-Allow-Origin: http://localhost:8080\r\n" +
        $"Access-Control-Allow-Methods: POST, OPTIONS, GET\r\n" +
        $"Connection: keep-alive\r\n" +
        $"Access-Control-Allow-Headers: Content-Type" +
        $"\r\n\r\n";

    public void Dispose()
    {
        _client.Dispose();
        GC.SuppressFinalize(this);
    }
}
