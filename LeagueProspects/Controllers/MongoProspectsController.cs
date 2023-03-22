using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LeagueProspects.Services;
using LeagueProspects.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace LeagueProspects.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MongoProspectsController : ControllerBase
    {
        private readonly MongoProspectsServices _prospectsService;

        public MongoProspectsController(MongoProspectsServices prospectsServices) =>
            _prospectsService = prospectsServices;

        // GET: api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post(ProtoProspect newProspect)
        {
            MongoProspect tempMongoProspect = new MongoProspect();
            tempMongoProspect.FirstName = newProspect.FirstName;
            tempMongoProspect.LastName = newProspect.LastName;
            tempMongoProspect.TeamId = newProspect.TeamId;
            tempMongoProspect.PositionId = newProspect.PositionId;
            tempMongoProspect.AtBats = newProspect.AtBats;
            tempMongoProspect.StrikeOuts = newProspect.StrikeOuts;
            tempMongoProspect.Rbis = newProspect.Rbis;
            tempMongoProspect.BattingAvg = newProspect.BattingAvg;
            tempMongoProspect.HomeRuns = newProspect.HomeRuns;            
            await _prospectsService.CreateAsync(tempMongoProspect);
            return CreatedAtAction(nameof(Get), newProspect);
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
    public class ProtoProspect
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int TeamId { get; set; }
        public int PositionId { get; set; }
        public int AtBats { get; set; }
        public int StrikeOuts { get; set; }
        public int Rbis { get; set; }
        public decimal BattingAvg { get; set; }         
        public int HomeRuns { get; set; }
     }
}

