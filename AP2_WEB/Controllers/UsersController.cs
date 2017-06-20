using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using AP2_WEB.Models;

namespace AP2_WEB.Controllers
{
    /// <summary>
    /// user control represnting class.
    /// </summary>
    public class UsersController : ApiController
    {
        /// <summary>
        /// private member of database.
        /// </summary>
        private AP2_WEBContext db = new AP2_WEBContext();

        /// <summary>
        /// get user request.
        /// </summary>
        /// <returns>an action task</returns>
        // GET: api/Users
        public IQueryable<User> GetUsers()
        {
            return db.Users.OrderByDescending(user => user.Wins - user.Loses);
        }

        /// <summary>
        /// get user request.
        /// </summary>
        /// <param name="id">a user id</param>
        /// <returns>an action task</returns>
        // GET: api/Users/5
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> GetUser(string id)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        /// <summary>
        /// user put request.
        /// </summary>
        /// <param name="id">a user id</param>
        /// <param name="user">a user</param>
        /// <returns>an action task</returns>
        // PUT: api/Users/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutUser(string id, User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != user.Username)
            {
                return BadRequest();
            }

            db.Entry(user).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        /// <summary>
        /// user post request.
        /// </summary>
        /// <param name="user">a user to send.</param>
        /// <returns>an action task</returns>
        // POST: api/Users
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> PostUser(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!GetUsers().All(u => u.Username != user.Username))
            {
                return Content(HttpStatusCode.BadRequest, "Username");
            }
            if (!GetUsers().All(u => u.Email != user.Email))
            {
                return Content(HttpStatusCode.BadRequest, "Email");
            }

            user.Password = SHAEncryptor.ComputeHash(user.Password);

            db.Users.Add(user);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserExists(user.Username))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = user.Username }, user);
        }

        /// <summary>
        /// delete user post request.
        /// </summary>
        /// <param name="id">a user to delete</param>
        /// <returns>an action task</returns>
        // DELETE: api/Users/5
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> DeleteUser(string id)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            db.Users.Remove(user);
            await db.SaveChangesAsync();

            return Ok(user);
        }

        /// <summary>
        /// login post request.
        /// </summary>
        /// <param name="user">login user.</param>
        /// <returns>an action task</returns>
        [HttpPost]
        [ResponseType(typeof(void))]
        [Route("api/Users/login")]
        public async Task<IHttpActionResult> Login(User user)
        {
            string username = user.Username;
            string password = SHAEncryptor.ComputeHash(user.Password);

            User found = await db.Users.FindAsync(username);

            if (found == null)
            {
                return Content(HttpStatusCode.BadRequest, "Username");
            }
            if (found.Password != password)
            {
                return Content(HttpStatusCode.BadRequest, "Password");
            }

            return Ok();
        }

        /// <summary>
        /// win post request.
        /// </summary>
        /// <param name="user">a winning user.</param>
        /// <returns>an action task</returns>
        [HttpPost]
        [ResponseType(typeof(void))]
        [Route("api/Users/win")]
        public async Task<IHttpActionResult> Win(User user)
        {
            User found = await db.Users.FindAsync(user.Username);

            if (found == null)
            {
                return Content(HttpStatusCode.BadRequest, "Username");
            }

            db.Entry(found).Entity.Wins += 1;
            db.Entry(found).State = EntityState.Modified;
            await db.SaveChangesAsync();

            return Ok();
        }

        /// <summary>
        /// lose post request.
        /// </summary>
        /// <param name="user">a losing user.</param>
        /// <returns>an action task</returns>
        [HttpPost]
        [ResponseType(typeof(void))]
        [Route("api/Users/lose")]
        public async Task<IHttpActionResult> Lose(User user)
        {
            User found = await db.Users.FindAsync(user.Username);

            if (found == null)
            {
                return Content(HttpStatusCode.BadRequest, "Username");
            }

            db.Entry(found).Entity.Loses += 1;
            db.Entry(found).State = EntityState.Modified;
            await db.SaveChangesAsync();

            return Ok();
        }

        /// <summary>
        /// disposing the database.
        /// </summary>
        /// <param name="disposing">a boolean</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        /// <summary>
        /// returns whether a user exists in database.
        /// </summary>
        /// <param name="id">a user id</param>
        /// <returns>whether a user exists in database.</returns>
        private bool UserExists(string id)
        {
            return db.Users.Count(e => e.Username == id) > 0;
        }
    }
}