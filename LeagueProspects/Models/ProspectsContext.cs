using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace LeagueProspects.Models;

public partial class ProspectsContext : DbContext
{
    public ProspectsContext()
    {
    }

    public ProspectsContext(DbContextOptions<ProspectsContext> options)
        : base(options)
    {
    }

    public virtual DbSet<League> Leagues { get; set; }

    public virtual DbSet<Player> Players { get; set; }

    public virtual DbSet<Position> Positions { get; set; }

    public virtual DbSet<Position1> Positions1 { get; set; }

    public virtual DbSet<StatProfile> StatProfiles { get; set; }

    public virtual DbSet<Team> Teams { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=eds-azure.database.windows.net,1433;Initial Catalog=Prospects;User ID=ericsergio;Password=r1gHtCl1ck$;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=50;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<League>(entity =>
        {
            entity.ToTable("League");

            entity.HasIndex(e => e.Id, "IX_FK_Leagueid");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.LeagueName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("league_name");
        });

        modelBuilder.Entity<Player>(entity =>
        {
            entity.ToTable("Player");

            entity.HasIndex(e => e.Id, "IX_FK_Playerid");

            entity.HasIndex(e => e.Id, "IX_FK_Playerteam_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AtBats).HasColumnName("at_bats");
            entity.Property(e => e.BattingAvg)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("batting_avg");
            entity.Property(e => e.FirstName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("first_name");
            entity.Property(e => e.HomeRuns).HasColumnName("home_runs");
            entity.Property(e => e.LastName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("last_name");
            entity.Property(e => e.PositionId).HasColumnName("position_id");
            entity.Property(e => e.Rbis).HasColumnName("rbis");
            entity.Property(e => e.StrikeOuts).HasColumnName("strike_outs");
            entity.Property(e => e.TeamId).HasColumnName("team_id");

            entity.HasOne(d => d.Position).WithMany(p => p.Players)
                .HasForeignKey(d => d.PositionId)
                .HasConstraintName("FK_PositionPlayer");

            entity.HasOne(d => d.Team).WithMany(p => p.Players)
                .HasForeignKey(d => d.TeamId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PlayerTeam");
        });

        modelBuilder.Entity<Position>(entity =>
        {
            entity.ToTable("Position");

            entity.HasIndex(e => e.Id, "IX_FK_Positionid");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PositionName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("position_name");
        });

        modelBuilder.Entity<Position1>(entity =>
        {
            entity.ToTable("Positions");

            entity.HasIndex(e => e.Id, "IX_FK_Positionsid");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PositionName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("position_name");
        });

        modelBuilder.Entity<StatProfile>(entity =>
        {
            entity.ToTable("Stat_Profile");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OverallRank).HasColumnName("overall_rank");
            entity.Property(e => e.PlayerId).HasColumnName("player_id");
            entity.Property(e => e.PositionId).HasColumnName("position_id");
            entity.Property(e => e.PositionRank).HasColumnName("position_rank");
            entity.Property(e => e.TeamRank).HasColumnName("team_rank");

            entity.HasOne(d => d.Player).WithMany(p => p.StatProfiles)
                .HasForeignKey(d => d.PlayerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PlayerPlayer_Profiles");
        });

        modelBuilder.Entity<Team>(entity =>
        {
            entity.ToTable("Team");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.LeagueId).HasColumnName("league_id");
            entity.Property(e => e.TeamName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("team_name");

            entity.HasOne(d => d.League).WithMany(p => p.Teams)
                .HasForeignKey(d => d.LeagueId)
                .HasConstraintName("FK_TeamLeague");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
