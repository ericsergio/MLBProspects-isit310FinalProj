using System;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
namespace LeagueProspects.Models
{
	public class MongoProspect
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string? Id { get; set; }

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public int TeamId { get; set; }

        public int? PositionId { get; set; }

        public int? AtBats { get; set; }

        public int? StrikeOuts { get; set; }

        public int? Rbis { get; set; }

        public decimal? BattingAvg { get; set; }

        public int? HomeRuns { get; set; }
    }
}

