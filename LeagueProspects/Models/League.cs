using System;
using System.Collections.Generic;

namespace LeagueProspects.Models;

public partial class League
{
    public int Id { get; set; }

    public string LeagueName { get; set; } = null!;

    public virtual ICollection<Team> Teams { get; } = new List<Team>();
}
