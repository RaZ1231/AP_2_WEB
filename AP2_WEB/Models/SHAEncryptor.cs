using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace AP2_WEB.Models
{
    /// <summary>
    /// encrypting class represnting.
    /// </summary>
    public class SHAEncryptor
    {
        /// <summary>
        /// computing hash function.
        /// </summary>
        /// <param name="input">a string to encrypt</param>
        /// <returns>returns encrypted string.</returns>
        public static string ComputeHash(string input)
        {
            SHA1 sha = SHA1.Create();
            byte[] buffer = Encoding.ASCII.GetBytes(input);
            byte[] hash = sha.ComputeHash(buffer);
            string hash64 = Convert.ToBase64String(hash);
            return hash64;
        }
    }
}