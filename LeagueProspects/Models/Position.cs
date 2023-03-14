using System;
using System.Collections.Generic;

namespace LeagueProspects.Models;

public partial class Position
{
    public int Id { get; set; }

    public string PositionName { get; set; } = null!;

    public virtual ICollection<Player> Players { get; } = new List<Player>();
}
