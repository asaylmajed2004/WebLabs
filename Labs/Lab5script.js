const playerRows = document.getElementById("player-rows");
const searchInput = document.getElementById("search");
const teamFilter = document.getElementById("team-filter");
const darkModeButton = document.getElementById("dark-mode-toggle");
const headers = document.querySelectorAll("#player-stats th");

const columns = ["name", "team", "points", "rebounds", "assists"];

let currentSort = {
    column: "",
    direction: "asc"
};

const getTeamCode = (team) => {
    let start = team.indexOf("(");
    let end = team.indexOf(")");
    return team.substring(start + 1, end);
};

const populateTeams = () => {
    let teams = [];

    data.forEach(player => {
        let code = getTeamCode(player.team);
        if (teams.indexOf(code) === -1) {
            teams.push(code);
        }
    });

    teams.sort();

    teams.forEach(team => {
        const option = document.createElement("option");
        option.value = team;
        option.innerText = team;
        teamFilter.appendChild(option);
    });
};

const displayPlayers = (players) => {
    playerRows.innerHTML = "";

    if (players.length === 0) {
        playerRows.innerHTML = "<tr><td colspan='5'>No players found</td></tr>";
        return;
    }

    players.forEach(player => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        const teamCell = document.createElement("td");
        const pointsCell = document.createElement("td");
        const reboundsCell = document.createElement("td");
        const assistsCell = document.createElement("td");

        nameCell.innerText = player.name;
        teamCell.innerText = getTeamCode(player.team);
        pointsCell.innerText = player.points;
        reboundsCell.innerText = player.rebounds;
        assistsCell.innerText = player.assists;

        row.appendChild(nameCell);
        row.appendChild(teamCell);
        row.appendChild(pointsCell);
        row.appendChild(reboundsCell);
        row.appendChild(assistsCell);

        playerRows.appendChild(row);
    });
};

const getValue = (player) => {
    if (currentSort.column === "name") {
        return player.name;
    }
    if (currentSort.column === "team") {
        return getTeamCode(player.team);
    }
    if (currentSort.column === "points") {
        return player.points;
    }
    if (currentSort.column === "rebounds") {
        return player.rebounds;
    }
    return player.assists;
};

const sortPlayers = (players) => {
    if (currentSort.column === "") {
        return players;
    }

    let ascending = currentSort.direction === "asc";

    players.sort((a, b) => {
        let aVal = getValue(a);
        let bVal = getValue(b);

        if (aVal < bVal) {
            return ascending ? -1 : 1;
        }
        if (aVal > bVal) {
            return ascending ? 1 : -1;
        }
        return 0;
    });

    return players;
};

const filterPlayers = () => {
    const searchValue = searchInput.value.toLowerCase();
    const selectedTeam = teamFilter.value;

    let filteredPlayers = data.filter(player => {
        const matchesSearch = player.name.toLowerCase().indexOf(searchValue) > -1;
        const matchesTeam = selectedTeam === "all" || getTeamCode(player.team) === selectedTeam;
        return matchesSearch && matchesTeam;
    });

    filteredPlayers = sortPlayers(filteredPlayers);
    displayPlayers(filteredPlayers);
};

const sortBy = (column) => {
    if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
    } else {
        currentSort.column = column;
        currentSort.direction = "asc";
    }

    filterPlayers();
};

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

searchInput.addEventListener("keyup", filterPlayers);

teamFilter.addEventListener("change", filterPlayers);

darkModeButton.addEventListener("click", toggleDarkMode);

playerRows.addEventListener("mouseover", (event) => {
    const row = event.target.closest("tr");

    if (row !== null) {
        row.style.fontWeight = "bold";
    }
});

playerRows.addEventListener("mouseout", (event) => {
    const row = event.target.closest("tr");

    if (row !== null) {
        row.style.fontWeight = "normal";
    }
});

headers.forEach((header, index) => {
    header.addEventListener("click", () => {
        sortBy(columns[index]);
    });
});

populateTeams();
displayPlayers(data);
