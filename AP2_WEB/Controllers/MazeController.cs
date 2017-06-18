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
    public class MazeController : ApiController
    {
        private static Dictionary<string, MazeGame> pending = new Dictionary<string, MazeGame>();
        public static Dictionary<string, MazeGame> Pending { get => pending; set => pending = value; }

        private static Dictionary<string, MazeGame> multi = new Dictionary<string, MazeGame>();
        public static Dictionary<string, MazeGame> Multi { get => multi; set => multi = value; }

        private static Dictionary<string, MazeGame> single = new Dictionary<string, MazeGame>();
        public static Dictionary<string, MazeGame> Single { get => single; set => single = value; }


        // list
        public IEnumerable<string> GetAllMazes()
        {
            if (Pending.Count == 0)
            {
                return new List<string>();
            }

            return Pending.Values.Select(game => game.Name);
        }

        // join
        public JObject GetMaze(string id)
        {
            Maze maze = Pending.Values.FirstOrDefault(p => p.Maze.Name.Equals(id)).Maze;

            if(maze == null) // not found
            {
                return JObject.Parse("");
            }

            return JObject.Parse(maze.ToJSON());
        }

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