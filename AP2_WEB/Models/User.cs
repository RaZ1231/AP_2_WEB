using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AP2_WEB.Models
{
    public class User
    {
        [Key]
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string Email { get; set; }
        [Range(0, int.MaxValue)]
        public int Wins { get; set; }
        [Range(0, int.MaxValue)]
        public int Loses { get; set; }
        public DateTime JoinDate { get; set; }
    }
}