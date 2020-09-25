const sportsTeamContainer = document.getElementById('sports-team-container')
const stateForm = document.getElementById('state-form')
const addTeamButton = document.getElementsByClassName("add-team-button")
const statesPath = "http://localhost:3000/states"

document.addEventListener('DOMContentLoaded', (event) => {
    fetch(statesPath)
    .then(function(obj) {
        return obj.json()
    })
    .then(function(statesArray) {
        statesArray.forEach(makeStateDiv)
    })
});



function makeStateDiv(state) {
    if (state.teams)
        {sportsTeamContainer.innerHTML += `
        <div id="state-${state.id}">
        <div id="state-${state.id}-details">
            <p>Name: ${state.name}</p>
        </div>
        <ul id="state-${state.id}-teams">
        ${state.teams.map(makeTeamList).join('')}
        </ul>
        <div id="actions-${state.id}" class="actions">
            <button type="button" id="add-team-button-${state.id}" onClick="showForm(${state.id})">Add Team</button>
            <button class="delete-button" data-state=${state.id}>Delete State</button>
        </div>
        <div id="add-team-form-${state.id}" class="add-team-form">
            <form class="team-form" id="team-form-${state.id}" onSubmit="submitTeam(${state.id}, event)">
                <label>Team Name</label>
                <input type="text" name="team" id="team-input-${state.id}">
                <label>Sport</label>
                <input type="text" name="sport" id="sport-input-${state.id}">
                <input type="hidden" name="state-id" id="state-input-${state.id}" value="${state.id}"/>
                </br>
            <input type="submit" value="Submit Team">
            </form>
        </div>
        <p>==================<p>
        </div>
        `}
    else {sportsTeamContainer.innerHTML += `
        <div id="state-${state.id}">
        <div id="state-${state.id}-details">
            <p>Name: <span id="state-${state.id}-name" class="state-name">${state.name}</span></p>
        </div>
        <ul id="state-${state.id}-teams">
        </ul>  
        <div id="actions-${state.id}" class="actions">
            <button type="button" id="add-team-button-${state.id}" onClick="showForm(${state.id})">Add Team</button>
            <button class="delete-button" data-state=${state.id}>Delete State</button>
        </div>
        <div id="add-team-form-${state.id}" class="add-team-form">
            <form class="team-form" id="team-form-${state.id}" onSubmit="submitTeam(${state.id}, event)">
                <label>Team Name</label>
                <input type="text" name="team" id="team-input-${state.id}">
                <label>Sport</label>
                <input type="text" name="sport" id="sport-input-${state.id}">
                <input type="hidden" name="state-id" id="state-input-${state.id}" value="${state.id}"/>
                </br>
                <input type="submit" value="Submit Team">
            </form>
        </div>
        <p>==================<p>
        </div>
        `
    }
}

function makeTeamList(team) {
    return `<li>${team.name}, ${team.sport}</li>`
}

sportsTeamContainer.addEventListener('click', function(e) {
    if (e.target.className == "delete-button") {
        e.preventDefault()
        let stateId = e.target.dataset.state
        deleteState(stateId)
    }
})

function deleteState(stateId) {
    let deleteData = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(stateId)  
    }
    return fetch(`http://localhost:3000/states/${stateId}`, deleteData)
        .then(function(response) {
            return response.json()
        })
        .then(function(state) {
            alert("Succesfully Deleted State")
            document.querySelector(`#state-${state.id}`).remove()
        })
}

stateForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let state = {name:document.querySelector("[name='state']").value} 
    fetchAndCreateState(state)
})

function showForm(index) {
    document.getElementById("actions-"+index).style.display = "none"
    document.getElementById("add-team-form-"+index).style.display = "block"
}

function hideForm(index) {
    document.getElementById("actions-"+index).style.display = "block"
    document.getElementById("add-team-form-"+index).style.display = "none"
}

function fetchAndCreateState(state) {
    let postData = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(state)  
    }
    return fetch("http://localhost:3000/states", postData)
        .then(function(response) {
            return response.json()
        })
        .then(function(stateData) {
            makeStateDiv(stateData)
        })
}

function fetchAndCreateTeam(team) {
fetch("http://localhost:3000/teams", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify(team)
})
    .then(function(response) {
        return response.json()
    })
    .then(function(teamData) {
        makeTeamList(teamData)
    })  
    .catch(error => {console.log(error)})
}

function submitTeam(index, e) {
    e.preventDefault()
    let team = {name:document.getElementById("team-input-"+index).value, sport:document.getElementById("sport-input-"+index).value, state_id:document.getElementById("state-input-"+index).value}
    fetchAndCreateTeam(team)
    document.getElementById("state-"+index+"-teams").innerHTML += makeTeamList(team)
    hideForm(index) 
}
