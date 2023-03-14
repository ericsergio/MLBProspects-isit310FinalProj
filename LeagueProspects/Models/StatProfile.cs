using System;
using System.Collections.Generic;

namespace LeagueProspects.Models;

public partial class StatProfile
{
    public int Id { get; set; }

    public int PlayerId { get; set; }

    public int PositionId { get; set; }

    public int? PositionRank { get; set; }

    public int? TeamRank { get; set; }

    public int? OverallRank { get; set; }

    public virtual Player Player { get; set; } = null!;
}
