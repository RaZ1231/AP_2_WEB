using AP2_WEB.Controllers;
using AP2_WEB.Models;
using MazeComp;
using MazeGeneratorLib;
using MazeLib;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AP2_WEB.SignalR
{
    public class GameHub : Hub
    {
        public void Send(string name, string message)
        {
            // Call the broadcastMessage method to update clients
            Clients.All.broadcastMessage(name, message);
        }

        public void Start(string name, int rows, int cols)
        {
            Maze maze = new DFSMazeGenerator().Generate(rows, cols);

            maze.Name = name;

            MazeGame game = new MazeGame()
            {
                Name = name,
                Maze = maze
            };

            game.Players.Add(Context.ConnectionId, maze.InitialPos);

            MazeController.Pending[name] = game;
        }

        public void Join(string name)
        {
            MazeGame game = MazeController.Pending[name];

            MazeController.Pending.Remove(name);
            MazeController.Multi[name] = game;

            game.Players.Add(Context.ConnectionId, game.Maze.InitialPos);

            string json = game.Maze.ToJSON();

            game.Players.Keys.ToList().ForEach(id => Clients.Client(id).broadcastMessage(json));
        }

        public void Move(string name, int direction)
        {
            MazeGame game = MazeController.Multi[name];

            Move move = new Move()
            {
                MazeName = game.Name,
                Direction = (Direction)direction
            };

            string json = move.ToJSON();

            game.Players.Keys.Where(id => id != Context.ConnectionId).ToList()
                .ForEach(id => Clients.Client(id).broadcastMessage(json));
        }
    }
}