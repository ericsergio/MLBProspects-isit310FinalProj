using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LeagueProspects.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace LeagueProspects.Controllers
{
    [Route("api/[controller]/[action]")]
    public class PlayersController : Controller
    {
        // GET: api/values
        [HttpGet]
        [ActionName("GetPlayers")]
        //public IEnumerable<string> Get()
        public List<PlayerData> Get()
        {
            List<PlayerData> playerList = new List<PlayerData>();
            var context = new ProspectsContext();
                var playerQuery = from p in context.Players
                                  //from t in context.Teams
                                  //from pos in context.Positions
                                  select new 
                                  {
                                      p.Id, p.FirstName, p.LastName, p.Team.TeamName, p.Position.PositionName,
                                      p.AtBats, p.StrikeOuts, p.Rbis, p.BattingAvg, p.HomeRuns                                      
                                  };
            foreach (var item in playerQuery) {
                PlayerData pdata = new PlayerData();
                    pdata.Id = item.Id;
                    pdata.First = item.FirstName;
                    pdata.Last = item.LastName;                    
                    pdata.Team = item.TeamName;
                    pdata.Pos = item.PositionName;
                    pdata.AtBats = (int)item.AtBats;
                    pdata.StrikeOuts = (int)item.StrikeOuts;
                    pdata.Rbis = (int)item.Rbis;
                    pdata.BattingAvg = (decimal)item.BattingAvg;
                    pdata.HomeRuns = (int)item.HomeRuns;                    
                    playerList.Add(pdata);
            }
            return playerList;
        }
        [HttpGet]
        [ActionName("GetPositions")]        
        public IEnumerable<Position>GetPositions()
        {
            var context = new ProspectsContext();            
            return context.Positions.ToList();
        }

        [HttpGet]
        [ActionName("GetTeams")]
        public IEnumerable<Team> GetTeams()
        {
            var context = new ProspectsContext();            
            return context.Teams.ToList();
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
        // POST api/<PlayerController>/NewPlayer
        [HttpPost]
        [ActionName("NewPlayer")]
        public void Post([FromBody] NewPlayer onePlayer)
        {
            var context = new ProspectsContext();
            Player newPlayerData = new Player();
            newPlayerData.FirstName = onePlayer.FirstName;
            newPlayerData.LastName = onePlayer.LastName;
            newPlayerData.TeamId = onePlayer.TeamId;
            newPlayerData.PositionId = onePlayer.PositionId;
            newPlayerData.AtBats = 0;
            newPlayerData.StrikeOuts = 0;
            newPlayerData.Rbis = 0;
            newPlayerData.BattingAvg = 0;
            newPlayerData.HomeRuns = 0;
            try
            {
                context.Players.Add(newPlayerData);
                context.SaveChanges();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }


    
    public class PlayerData
    {
        public int Id { get; set; }
        public string First { get; set; }
        public string Last { get; set; }
        public string Team { get; set; }
        public string Pos { get; set; }
        public int AtBats { get; set; }
        public int StrikeOuts { get; set; }
        public int Rbis { get; set; }
        public decimal BattingAvg { get; set; }
        public int HomeRuns { get; set; }

        public PlayerData()
        {

        }

        public PlayerData(int id, string pos)
        {
            this.Id = id;
            this.Pos = pos;
        }

        public PlayerData(int id, string first, string last, string team, string pos, int atBats, int strikeOuts, int rbis, decimal battingAvg, int homeRuns)
        {
            this.Id = id;
            this.First = first;
            this.Last = last;
            this.Team = team;
            this.Pos = pos;
            this.AtBats = atBats;
            this.StrikeOuts = strikeOuts;
            this.Rbis = rbis;
            this.BattingAvg = battingAvg;
            this.HomeRuns = homeRuns;
        }

        public string getId()
        {
            return this.Id.ToString();
        }
        public string getFirst()
        {
            return this.First;
        }
        public string getLast()
        {
            return this.Last;
        }
        public string getTeam()
        {
            return this.Team;
        }
        public string getPos()
        {
            return this.Pos;
        }
        public string getAtBats()
        {
            return this.AtBats.ToString();
        }
        public string getStrikeOuts()
        {
            return this.StrikeOuts.ToString();
        }
        public string getRbis()
        {
            return this.Rbis.ToString();
        }
        public string getBattingAvg()
        {
            return this.BattingAvg.ToString();
        }
        public string getHomeRuns()
        {
            return this.HomeRuns.ToString();
        }
    }
    public class NewPlayer
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int TeamId { get; set; }
        public int PositionId { get; set; }
    }

}
