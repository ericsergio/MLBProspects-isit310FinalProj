using System;
using System.Collections.Generic;

namespace LeagueProspects.Models;

public partial class Team
{
    public int Id { get; set; }

    public string TeamName { get; set; } = null!;

    public int? LeagueId { get; set; }

    public virtual League? League { get; set; }

    public virtual ICollection<Player> Players { get; } = new List<Player>();
}
