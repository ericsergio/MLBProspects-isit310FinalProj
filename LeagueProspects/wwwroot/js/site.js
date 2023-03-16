// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


function Players(id, first_name, last_name, team_id, position_id, at_bats, strike_outs, rbis, batting_avg, home_runs) {
    this.id = id;
    this.first_name = first_name || null;
    this.last_name = last_name || null;
    this.team_id = team_id || null;
    this.position_id = position_id || null;
    this.at_bats = at_bats || null;
    this.strike_outs = strike_outs || null;
    this.rbis = rbis || null;
    this.batting_avg = batting_avg || null;
    this.home_runs = home_runs || null;
}

function NewPlayer(first_name, last_name, team_id, position_id) {
    this.first_name = first_name || null;
    this.last_name = last_name || null;
    this.team_id = team_id | null;
    this.position_id = position_id || null;
}

function Validate(pointer) {
    this.pointer = pointer || 0;
}

Validate.doValidate = new Validate(0);


function Positions(id, positionName) {
    this.id = id;
    this.positionName = positionName;    
}

function Teams(id, teamName, league_id) {
    this.id = id;
    this.teamName = teamName;
    this.league_id = league_id;
}

function Selected(id, category, sname) {
    this.id = id || null;
    this.category = category || null;
    this.sname = sname || null;
}

Selected.current = new Selected();
//Positions.current = new Positions();


Positions.prototype.getPositionId = function () {
    return this.id;
}

var tableHeaders = ['ID', 'First', 'Last', 'Team', 'Position', 'AtBats', 'StrikeOuts', 'Rbis', 'BattingAvg', 'HomeRuns'];

function buildTable() {
    $('body').css({
        'backgroundColor': '#BBCECE',
        'color':'#183030'
    });
    let ptbl = $('.playerTbl');
    ptbl.append('<tr>')
    for (let p in tableHeaders) {
        ptbl.append(`<th>${tableHeaders[p]}</th>`)
    }
}
buildTable();

$(document).ready(function () {
    let idx = 0;
    let instance = 'p';        
    $.getJSON('api/Players/GetPlayers').done(function (data) {
        for (let p in data) {
            let d = data[p];
            let idVal = d.id;
            let lastVal = d.last;
            lastVal = String(lastVal);
            idVal = String(idVal);
            //console.log(`idVal: ${typeof idVal}`)
            Players[[`${lastVal.substring(0, 2)}${idVal}`]] = new Players(d.id, d.first, d.last, d.team,
                d.pos, d.atBats, d.strikeOuts, d.rbis, d.battingAvg, d.homeRuns)
            $('.playerTbl').append(`<tr id = ${lastVal.substring(0, 2)}_${idVal}>`);
            for (let p2 in data[p]) {
                let e = data[p][p2];
                $('.playerTbl').children().last().after().append(`<td>${e}</td>`);
            }
            $('.playerTbl').append('</tr>');
        }
    });   
})



$(document).ready(function () {
    $.getJSON('api/Players/GetPositions').done(function (data) {        
        for (p in data) {
            Positions[[data[p].positionName]] = new Positions(data[p].id, data[p].positionName);
        }
        $('.sInput').prepend(`
        <select class = 'target_p' name = "position_dd" id = "position_drop"><option value="Position" id="positionStart" selected="selected">Select Position</option></select>`
        );
        doPosDropDown();
    });
});

$(document).ready(function () {
    $.getJSON('api/Players/GetTeams').done(function (data) {
        for (p in data) {
            let tname = data[p].teamName;
            tname = String(tname.replace(' ', '_').toLowerCase());
            tname = Object(tname);
            Teams[[tname]] = new Teams(data[p].id, data[p].teamName, data[p].league_id);
        }
        $('.sInput').prepend(`
        <select class = 'target_t' name = "team_dd" id = "team_drop"><option value="Team" id="teamStart" selected="selected">Select Team</option></select>`
        );
        doTeamDropDown();
    });
});

const doPosDropDown = () => {
    for (let p in Positions) {
        console.log(Positions[p])
        let val = `${String(Positions[p].positionName).toLowerCase()}`;
        $('#position_drop').append(`<option value="${val}" id=pos${Positions[p].id}>${Positions[p].positionName}</option>`);
    };

    $('select#position_drop.target_p').change(function () {        
        Selected.current.id = 2;
        Selected.current.category = 'positions';
        Selected.current.sname = $('select#position_drop.target_p').val();
        doFilterByPosition();
    });
};

const doTeamDropDown = () => {
    for (let p in Teams) {
        let val = String(Teams[p].teamName).toLowerCase();
        $('#team_drop').append(`<option value="${val}" id=tea${Teams[p].id}>${Teams[p].teamName}</option>`);
    }

    $('select#team_drop.target_t').change(function () {        
        Selected.current.id = 1;
        Selected.current.category = 'teams';
        Selected.current.sname = $('select#team_drop.target_t').val();
        doFilterByTeam()
    });
};

const doFilterByTeam = () => {    
    let teamMatch = Selected.current.sname;
    $('.playerTbl tr').each(function () {
        String($(this).children('td:nth-child(4)').html()).toLowerCase() !== Selected.current.sname ? $(this).hide() : $(this).show();
    });
}

const doFilterByPosition = () => {
    let positionMatch = Selected.current.sname;
    $('.playerTbl tr').each(function () {
        String($(this).children('td:nth-child(5)').html()).toLowerCase() !== Selected.current.sname ? $(this).hide() : $(this).show();
    });
}

const doCollectPlayerData = () => {    
    $('.playerTbl').before(
        `<div class="addPlayerPrompt"><p class="pdescriptor"></p> \
        <input type="input" id="userTxt" class="userData"></input> \
        <input type = "button" id="newPlayerBtn" class="btnlvl1" value="GO" onclick="doCollectLevel2()"></input></div>`
    );
    NewPlayer.newPlayer = new NewPlayer();
    Validate.doValidate.pointer = 1;
    $('.addPlayerPrompt').css({
        'height':'15%',
        'display': 'grid',
        'gridTemplateColumns':'40% 35% 15%',
        'height': '25%',
        'width': '70%',
        'backgroundColor': '#004C99',
        'color': '#E0E0E0',
        'margin':'5% 15% 0 15%'
    });
    $('.pdescriptor').text('Please enter the players first name');
    $('.pdescriptor').css({
        'padding':'2px',
        'margin': '12px'        
    });
    $('.userData').css({
        'height': '30px',        
        'margin': '12px'
    });
    $('#newPlayerBtn').css({
        'height': '30px',        
        'margin':'12%'
    });
    $('#userTxt').focus();
    switchValidate();
};

const doCollectLevel2 = () => {
    //will validate first name with value of 1
    switchValidate();    
    NewPlayer.newPlayer.first_name = $('.userData').val();
    Validate.doValidate.pointer = 2;
    $('.pdescriptor').text('enter the last name');
    $('.userData').val('');    
    $('.pdescriptor').text('Please enter the players last name');    
    $('#newPlayerBtn').removeAttr('onclick');
    $('#newPlayerBtn').attr('onclick', 'doCollectLevel3()');
    $('#userTxt').focus();
};

const doCollectLevel3 = () => {
    //will validate last name with value of 2
    switchValidate();
    NewPlayer.newPlayer.last_name = $('.userData').val();
    Validate.doValidate.pointer = 3;
    $('.pdescriptor').text('what team does this player play on?');
    $('.userData').remove();
    let storeBtnElem = $('#newPlayerBtn').clone(true);
    $('#newPlayerBtn').remove();
    $('#team_drop').clone().appendTo('.addPlayerPrompt');
    $('.addPlayerPrompt #team_drop').change(function () {
        Selected.current.sname = $('.addPlayerPrompt #team_drop').val();        
        for (let i in Teams) {
            if (String(Teams[i].teamName).toLowerCase() === $('.addPlayerPrompt #team_drop').val()) {
                Selected.current.id = Teams[i].id;
            }
        }
        doCollectLevel4();
    });    
    $('#newPlayerBtn').removeAttr('onclick');
    $('#newPlayerBtn').attr('onclick', `doCollectLevel4(${storeBtnElem})`);
    $('#userTxt').focus();
}

const doCollectLevel4 = () => {
    //will validate team name with value of 3

    switchValidate();
    NewPlayer.newPlayer.team_id = Selected.current.id;
    Validate.doValidate.pointer = 4;
    $('.pdescriptor').text('what position does this player play?');
    $('#position_drop').clone().appendTo('.addPlayerPrompt');
    $('.addPlayerPrompt #team_drop').remove();
    $('.addPlayerPrompt #position_drop').change(function () {        
        let posString = $('.addPlayerPrompt #position_drop').val();            
        Selected.current.sname = $('.addPlayerPrompt #position_drop').val();
        for (let i in Positions) {
            console.log(`<><><>${String(Positions[i].positionName).toLowerCase()}`);
            if (String(Positions[i].positionName).toLowerCase() === $('.addPlayerPrompt #position_drop').val()) {
                console.log(`||||||${Positions[i].getPositionId()}`)
                NewPlayer.newPlayer.position_id = Positions[i].getPositionId();
            }
        }
        doApiCall();        
    });
    $('#newPlayerBtn').removeAttr('onclick');
    $('#newPlayerBtn').attr('onclick', 'doApiCall()');
    $('#userTxt').focus();
}
const doApiCall = () => {
    //will validate the position name with value of 4 then should be reset back to 0 for the next player to add
    switchValidate();    
    Validate.doValidate.pointer = 0;
    $('.addPlayerPrompt').remove();
    $.ajax({
        url: 'api/Players/NewPlayer',
        method: 'POST',
        contentType: 'application/json',
        //data: JSON.stringify(NewPlayer.newPlayer),
        data: JSON.stringify({
            FirstName: NewPlayer.newPlayer.first_name, LastName: NewPlayer.newPlayer.last_name, TeamId: NewPlayer.newPlayer.team_id, PositionId: NewPlayer.newPlayer.position_id
        }),
        success: function (response) {
            console.log(response);
            location.reload();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

const switchValidate = () => {
    switch (Validate.doValidate.pointer) {
        case 1:
            console.log('validate first name');
            break;
        case 2:
            console.log('validate last name');
            break;
        case 3:
            console.log('validate team name');
            break;
        case 4:
            console.log('validate position name');
            break;
        default:
            console.log('not sure... tbd');
    }
}
