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

Selected.current = new Selected()

Positions.prototype.getPosition = function () {
    return this.positionName;
}

var tableHeaders = ['ID', 'First', 'Last', 'Team', 'Position', 'AtBats', 'StrikeOuts', 'Rbis', 'BattingAvg', 'HomeRuns'];

function buildTable() {
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
                $('.playerTbl').children().last().after(`<td>${e}</td>`)
            }
            $('.playerTbl').append('</tr>');
        }
    });
    $('tr').css('backgroundColor', 'lightBlue');
})

$(document).ready(function () {
    $.getJSON('api/Players/GetPositions').done(function (data) {        
        for (p in data) {
            Positions[[data[p].positionName]] = new Positions(data[p].id, data[p].positionName);
        }
        $('.srchInput').append(`
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
        $('.srchInput').append(`
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
    $('#position_drop').children().each(function () {
        $(this).addClass('unselected');
    });

    $('select#position_drop.target_p').change(function () {
        console.log($('select#position_drop.target_p').val());
        Selected.current.id = 2;
        Selected.current.category = 'positions';
        Selected.current.sname = $('select#position_drop.target_p').val();
    });
};

const doTeamDropDown = () => {
    for (let p in Teams) {
        let val = String(Teams[p].teamName).toLowerCase();
        $('#team_drop').append(`<option value="${val}" id=tea${Teams[p].id}>${Teams[p].teamName}</option>`);
    }
    $('#team_drop').children().each(function () {
        $(this).addClass('unselected');
    });
    $('select#team_drop.target_t').change(function () {
        console.log($('select#team_drop.target_t').val());
        Selected.current.id = 1;
        Selected.current.category = 'teams';
        Selected.current.sname = $('select#position_drop.target_t').val();
    });
};



/*
  static adminDisplayData(query_in:string, idx:number) {
    let mongo_out = `${query_in}/${idx}`;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (e) => {
      console.log(`onreadystatechanged error :${e}`);
    }
    var n = 0;
    var responseArr: any[] = [];
    var tblExist = document.getElementsByTagName('table').length;
    (tblExist === 0) ? this.buildTable() : this.rebuildTable();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200)
          var o = JSON.parse(xhr.responseText);
          for(var p in o) {
            var current = o[p];
            responseArr.push(current);
            var tbl = document.getElementsByClassName('displayTbl')[0];
            var row = document.createElement('tr');
            for(var p2 in responseArr) {
              tbl.appendChild(row);
              row.setAttribute('class', 'current');
              for(var d in responseArr[p2]) {
                this.addData((responseArr[p2][d]),n, d, row);
              }
            }
            row.removeAttribute('class');
            n += 1;
            //as it goes through each object and puts data in the td elements, when finished, remove it from array
            //so the next item is processed.
            JSON.stringify(responseArr.reverse().pop());
          }
          this.doTableElems(idx);
    }
    xhr.open("GET", mongo_out, true);
    xhr.send(null);
  }

  static addData(d:any,n:number, dtag:any, rowElem:HTMLElement) {
    var data = document.createElement('td');
    rowElem.appendChild(data);
    var textNode = document.createTextNode(d);
    //only add data element text for strings and numbers - objects hide
    typeof d !== 'object' ? data.appendChild(textNode) : console.log();
    data.setAttribute('class', dtag );
    document.getElementsByClassName('_id')[n].setAttribute('hidden', 'true')
  }

  static buildTable() {
    let tbl = document.createElement('table');
    let tblRows = document.getElementsByTagName('tr');
    let divElem = document.getElementsByClassName('dbGrid')[0];
    divElem.after(tbl);
    tbl.setAttribute('class', 'displayTbl');
    $('.displayTbl').css({'position':'absolute','left':'10%','top':'45%','backgroundColor': 'yellow', 'border':'solid 7px #000000'});
    $('.displayTbl').prepend('<input type = "button" class = "x" value = "X"></input>').on('click', () => {
      $('.displayTbl').remove();
    });
  }

  static rebuildTable() {
    document.getElementsByTagName('table')[0].remove();
    this.buildTable();
  }

  static doTableElems(idx:number) {
    var fields: (string | undefined)[] = [];
    var fieldVals: (string | undefined)[] = [];
    $('.selectedItem').remove();
    $('td').on('click', function () {
      $('.dbGrid').append('<div class = "dynContain"><ul class = "selectedItem"></ul></div>');
      $('.selectedItem').css({'width': '50%', 'display':'grid', 'color':'#ffffff', 'marginTop':'2%'})
      console.log($(this).parent().children().attr('id'))
      $(this).parent().children().each(function() {
        $('.selectedItem').append(`<li class="li_${$(this).attr('class')}">${$(this).attr('class')} :  ${$(this).html()}</li>`);
        fields.push($(this).attr('class'));
        fieldVals.push($(this).html());
      })
      DatabaseService.doForm(fields, idx, fieldVals);
      $('table').remove();
      $('.dynContain').css({'position':'absolute', 'top':'40%', 'left':'12%', 'backgroundColor':'grey', 'width':'75%'});
      $('.dynContain .selectedItem').css({'backgroundColor':'#48576F', 'listStyleType':'none'});
      $('.dynContain .selectedItem li').css({'margin':'2% 0 0 20%'})
      //transition: width 0.4s ease-in-out;
    })
  }

  static doForm(fields:(string | undefined)[] = [], idx:number, fieldVals:(string | undefined)[] = []) {
    console.log(`first - ${fields[0]} second - ${fields[1]}`);
    $('.dynContain').append(`<form class="dynForm"></form>`);
    for (let p in fields) {
      $('.dynForm').append(`
      <input type = "text" id = "${fields[p]}" name = "${fields[p]}" placeholder = "${fields[p]}"></input>
      <br>`)
    }

    $('.dynForm').append(`<input type = "button" id = "submitbtn" value = "Submit"></input>`).css({'margin':'2%'});
    $('.dynForm').append(`<input type = "button" id = "deletebtn" value = "Delete"></input>`).css({'margin':'2%'});
    $('.dynContain').prepend(`<input type = "button" class = "x" value = "X"></input>`)
    $('#submitbtn').on('click', () => {
      var i = 0;
      $('input').each(function() {
        var n = Number(`${$(this).val()?.toString().length}`);
        if(n > 0 && ($(this).attr('id') !== 'submitbtn')) {
          fieldVals[i] = `${$(this).val()?.toString()}`
          console.log(`${fieldVals[i]}`);
        }
        i += 1;
      })
      let mongo_modify_out = `https://isit422-node-finale-2022.azurewebsites.net/api/findAndModify/${idx}/`;
      for(let i = 0;i < fields.length;i++) {
        mongo_modify_out += `|${fields[i]}:${fieldVals[i]}`;
      }
      console.log(`${mongo_modify_out}`);
      DatabaseService.findAndModify(mongo_modify_out);
    })
    $('#deletebtn').on('click', () => {
      var i = 0;
      $('input').each(function() {
        var n = Number(`${$(this).val()?.toString().length}`);
        if(n > 0 && ($(this).attr('id') !== 'submitbtn')) {
          fieldVals[i] = `${$(this).val()?.toString()}`
          console.log(`${fieldVals[i]}`);
        }
        i += 1;
      })
      let mongo_delete_out = `https://isit422-node-finale-2022.azurewebsites.net/api/delete/${idx}/`;
      for(let i = 0;i < fields.length;i++) {
        mongo_delete_out += `|${fields[i]}:${fieldVals[i]}`;
      }
      console.log(`${mongo_delete_out}`);
      DatabaseService.deleteRecord(mongo_delete_out);
    });
    $('.x').on('click', () => {
      $('.dynContain').remove();
    })
    $('.dynForm input').css({'width':'40%','margin':'0 50% 0 4%'});
    $('.li__id, #_id').hide();
  }

  static findAndModify(query_in:string) {
    let mongo_out = query_in;
    var xhr = new XMLHttpRequest;
    xhr.open("POST", mongo_out, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
      console.log(`${mongo_out}`);
      if (xhr.readyState == 4 && xhr.status == 200)
        var o = JSON.parse(xhr.responseText);
        console.log(o)
    }
    xhr.open("GET", mongo_out, true)
    xhr.send(null);
  }
  static deleteRecord(query_in:string) {
    let mongo_out = query_in;
    var xhr = new XMLHttpRequest;
    xhr.open("POST", mongo_out, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
      console.log(`${mongo_out}`);
      if (xhr.readyState == 4 && xhr.status == 200)
        var o = JSON.parse(xhr.responseText);
        console.log(o)
    }
    xhr.open("GET", mongo_out, true)
    xhr.send(null);
  }
}
*/


