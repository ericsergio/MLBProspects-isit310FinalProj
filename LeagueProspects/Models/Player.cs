using System;
using System.Collections.Generic;

namespace LeagueProspects.Models;

public partial class Player
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public int TeamId { get; set; }

    public int? PositionId { get; set; }

    public int? AtBats { get; set; }

    public int? StrikeOuts { get; set; }

    public int? Rbis { get; set; }

    public decimal? BattingAvg { get; set; }

    public int? HomeRuns { get; set; }

    public virtual Position? Position { get; set; }

    public virtual ICollection<StatProfile> StatProfiles { get; } = new List<StatProfile>();

    public virtual Team Team { get; set; } = null!;
}
