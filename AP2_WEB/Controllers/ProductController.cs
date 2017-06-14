using AP2_WEB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace AP2_WEB.Controllers
{
    public class ProductController : ApiController
    {
        private static List<Product> products = new List<Product>
        {
             new Product { Id = 1, Name = "Tomato Soup", Category = "Groceries", Price = 1 },
             new Product { Id = 2, Name = "Yo-yo", Category = "Toys", Price = 3.75M },
             new Product { Id = 3, Name = "Hammer", Category = "Hardware", Price = 16.99M }
        };

        public IEnumerable<Product> GetAllProducts()
        {
            return products;
        }

        public IHttpActionResult GetProduct(int id)
        {
            Product product = products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [System.Web.Http.HttpPost]
        public void AddProduct(Product p)
        {
            products.Add(p);
        }
    }
}