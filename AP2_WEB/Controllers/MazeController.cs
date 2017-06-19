using AP2_WEB.Models;
using MazeComp;
using MazeGeneratorLib;
using MazeLib;
using Newtonsoft.Json.Linq;
using SearchAlgorithmsLib;
using SearchAlgorithmsLib.searchers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
//
namespace AP2_WEB.Controllers
{
    /// <summary>
    /// maze controller reprenting class.
    /// </summary>
    public class MazeController : ApiController
    {
        /// <summary>
        /// private pending dictionary.
        /// </summary>
        private static Dictionary<string, MazeGame> pending = new Dictionary<string, MazeGame>();
        /// <summary>
        /// a public property.
        /// </summary>
        public static Dictionary<string, MazeGame> Pending { get { return pending; } set { pending = value; } }

            /// <summary>
            /// private multiPlayer dictionary.
            /// </summary>
            private static Dictionary<string, MazeGame> multi = new Dictionary<string, MazeGame>();
        /// <summary>
        /// a public property.
        /// </summary>
            public static Dictionary<string, MazeGame> Multi { get { return multi; } set { multi = value; } }

            /// <summary>
            /// private singlePlayer dictionary.
            /// </summary>
            private static Dictionary<string, MazeGame> single = new Dictionary<string, MazeGame>();
            /// <summary>
        /// a public property.
        /// </summary>
        public static Dictionary<string, MazeGame> Single { get { return single; } set { single = value; } }


        // list
        /// <summary>
        /// returns all available games.
        /// </summary>
        /// <returns>all available games in server</returns>
        public IEnumerable<string> GetAllMazes()
        {
            if (Pending.Count == 0)
            {
                return new List<string>();
            }

            return Pending.Values.Select(game => game.Name);
        }

        // join
        /// <summary>
        /// return requested maze
        /// </summary>
        /// <param name="id">an id</param>
        /// <returns>requested maze</returns>
        public JObject GetMaze(string id)
        {
            Maze maze = Pending.Values.FirstOrDefault(p => p.Maze.Name.Equals(id)).Maze;

            if(maze == null) // not found
            {
                return JObject.Parse("");
            }

            return JObject.Parse(maze.ToJSON());
        }

        /// <summary>
        /// generate get request
        /// </summary>
        /// <param name="name">maze name</param>
        /// <param name="rows">maze rows</param>
        /// <param name="cols">maze cols</param>
        /// <returns>a maze</returns>
        [HttpGet]
        [Route("Maze/generate/{name}/{rows}/{cols}")]
        public JObject Generate(string name, int rows, int cols)
        {
            Maze maze = new DFSMazeGenerator().Generate(rows, cols);

            maze.Name = name;

            Single[name] = new MazeGame()
            {
                Name = name,
                Maze = maze
            };

            return JObject.Parse(maze.ToJSON());
        }

        /// <summary>
        /// a mze solution.
        /// </summary>
        /// <param name="name">maze name</param>
        /// <param name="algo">solving algorithm</param>
        /// <returns>a solution</returns>
        [HttpGet]
        [Route("Maze/solve/{name}/{algo}")]
        public JObject Solve(string name, int algo)
        {
            MazeGame game = Multi.ContainsKey(name) ? Multi[name] : Single[name];

            if (game.Solution == null)
            {
                ISearcher<Position> searcher = algo == 0 ? (ISearcher<Position>) 
                                    new BFS<Position, int>((s1, s2) => 1, (i, j) => i + j) : 
                                    new DFS<Position>();
                SearchableMaze smaze = new SearchableMaze(game.Maze);
                game.Solution = MazeSolution.FromSolution(searcher.Search(smaze));
                game.Solution.MazeName = name;
            }

            return JObject.Parse(game.Solution.ToJSON());
        }

        /// <summary>
        /// starting a maze.
        /// </summary>
        /// <param name="name">maze name</param>
        /// <param name="rows">maze rows</param>
        /// <param name="cols">maze cols</param>
        /// <returns>a maze object</returns>
        [HttpGet]
        [Route("Maze/start/{name}/{rows}/{cols}")]
        public JObject Start(string name, int rows, int cols)
        {
            Maze maze = new DFSMazeGenerator().Generate(rows, cols);

            maze.Name = name;

            Pending[name] = new MazeGame()
            {
                Name = name,
                Maze = maze
            };

            return JObject.Parse(maze.ToJSON());
        }
    }
}