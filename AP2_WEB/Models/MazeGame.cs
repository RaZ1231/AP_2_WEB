using MazeLib;
using MazeComp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Web;

namespace AP2_WEB.Models
{
    public class MazeGame
    {
        /// <summary>
        /// Game's name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Game's maze.
        /// </summary>
        public Maze Maze { get; set; }

        /// <summary>
        /// A dictionary of player's to their positions in the maze.
        /// </summary>
        public Dictionary<TcpClient, Position> Players { get; set; }

        /// <summary>
        /// The number of players in the game.
        /// </summary>
        public int NumOfPlayers { get; set; }

        /// <summary>
        /// Maze's solution.
        /// </summary>
        public MazeSolution Solution { get; set; }

        /// <summary>
        /// Constructor.
        /// </summary>
        public MazeGame()
        {
            Players = new Dictionary<TcpClient, Position>();
            Solution = null;
        }

        /// <summary>
        /// Checks whether there are enough players to start the game.
        /// </summary>
        /// <returns> whether there are enough players. </returns>
        public Boolean ArePlayersReady()
        {
            return Players.Keys.Count >= NumOfPlayers;
        }
    }
}