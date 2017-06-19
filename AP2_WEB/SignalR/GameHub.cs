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
    /// <summary>
    /// game hub representing class.
    /// </summary>
    public class GameHub : Hub
    {
        /// <summary>
        /// send message.
        /// </summary>
        /// <param name="name">a name</param>
        /// <param name="message">a message</param>
        public void Send(string name, string message)
        {
            // Call the broadcastMessage method to update clients
            Clients.All.broadcastMessage(name, message);
        }

        /// <summary>
        /// start game
        /// </summary>
        /// <param name="name">maze name</param>
        /// <param name="rows">maze rows</param>
        /// <param name="cols">maze cols</param>
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

        /// <summary>
        /// join game
        /// </summary>
        /// <param name="name">a name</param>
        public void Join(string name)
        {
            MazeGame game = MazeController.Pending[name];

            MazeController.Pending.Remove(name);
            MazeController.Multi[name] = game;

            game.Players.Add(Context.ConnectionId, game.Maze.InitialPos);

            string json = game.Maze.ToJSON();

            game.Players.Keys.ToList().ForEach(id => Clients.Client(id).broadcastMessage(json));
        }

        /// <summary>
        /// move in game
        /// </summary>
        /// <param name="name">a name</param>
        /// <param name="direction">a direction</param>
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