using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AP2_WEB.Models
{
    /// <summary>
    /// maze object representing class.
    /// </summary>
    public class MazeObj
    {
        /// <summary>
        /// maze data.
        /// </summary>
        public string Data {get; set;}
        /// <summary>
        /// maze name.
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// maze cols.
        /// </summary>
        public int Cols { get; set; }
        /// <summary>
        /// maze rows.
        /// </summary>
        public int Rows { get; set; }
    }
}