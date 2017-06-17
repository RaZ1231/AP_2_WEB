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
    public class UsersController : ApiController
    {
        private AP2_WEBContext db = new AP2_WEBContext();

        // GET: api/Users
        public IQueryable<User> GetUsers()
        {
            return db.Users.OrderByDescending(user => user.Wins - user.Loses);
        }

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

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(string id)
        {
            return db.Users.Count(e => e.Username == id) > 0;
        }
    }
}