import React, {useEffect, useState} from 'react';
import {useFetcher} from "@remix-run/react"
import playersData from '~/data/examplePlayerData.json'
import Select from 'react-select';


// API consts
const fcbTeamId = 529;
const apiOptions = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '7d1b246b73mshf4e6dca98956c43p1677b0jsn678998a4e8b8',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
};
const playersUrl = 'https://api-football-v1.p.rapidapi.com/v3/players?team=' + fcbTeamId;

// Defining types
type selectOptionType = {
    value: number,
    label: string
}


const seasons: selectOptionType[] = [];
for (let i = 2023; i > 2013; i--) seasons.push({value: i, label: String(i)});


const actionTypes = [
    {value: 1, label: 'Player Goals', getValue: (stats: any) => stats?.goals?.total},
    {value: 2, label: 'Player Assists',getValue: (stats: any) => stats?.goals?.assists},
    {value: 3, label: 'Player Passes', getValue: (stats: any) => stats?.passes?.total},
    {value: 4, label: 'Player Shots', getValue: (stats: any) => stats?.shots?.total},
    {value: 5, label: 'Player Fouls', getValue: (stats: any) => stats?.fouls?.committed},
    {value: 6, label: 'Player Tackles', getValue: (stats: any) => stats?.tackles?.total},
    {value: 7, label: 'Team Win/Loss Ratio', getValue: (stats: any) => stats?.games?.lose},
]
const actionOptions: selectOptionType[] = actionTypes.map((op) => {
    return {value: op.value, label: op.label}
});

export const getPlayers = async (season: number | undefined) => {

    let players:any[] = [];
    playersData.forEach((page) => {
        players.push(...page.response);
    });
    console.log(players);
    return players;

    // season = season || 2023;
    // const url = playersUrl + '&season=' + season;
    // let page = 1, totalPages = 1;
    // const players:any[] = [];
    // try {
    //     do {
    //         const result = await fetch(url, apiOptions);
    //         const data = await result.json();
    //         totalPages = data.paging.total;
    //         page = data.paging.current + 1;
    //         players.concat(data.response);
    //     }
    //     while (page <= totalPages);
    //     console.log(players);
    //     return players;
    // } catch (error) {
    //     console.error(error);
    // }
    // return [];
}
export default function AnalystDashboard() {

    const [selectedAction, setSelectedAction] = useState<number | undefined>(undefined);
    const [selectedActionClass, setSelectedActionClass] = useState<string | undefined>(undefined);
    const [selectedSeason, setSelectedSeason] = useState<number | undefined>(undefined);
    const [players, setPlayers] = useState<any[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<number | undefined>(undefined);
    const [leaguesOptions, setLeaguesOptions] = useState<number[] | undefined>(undefined);
    const [selectedLeague, setSelectedLeague] = useState<number | undefined>(undefined);
    const [queryResult, setQueryResult] = useState<string | undefined>(undefined);

    // updating the players data when the selected season changes or the selected action  changes (player/team)
    useEffect(()  => {
        const fetchData = async () => {
            const playersDataFromApi = await getPlayers(selectedSeason);
            setPlayers(playersDataFromApi);
            setLeaguesOptions(playersDataFromApi[0].statistics.map((s: any) => {
                return {value: s.league.id, label: s.league.name};
            }));
        }
        selectedActionClass == "player" && selectedSeason && fetchData();

        console.log("changed league");
        const answerQuery = () => {
            console.log("answer query");
            if (selectedActionClass === "player") {
                const player = players.find((p) => p.player.id === selectedPlayer);
                const leagueStats = player?.statistics.find((s: any) => s.league.id === selectedLeague);
                const answer = actionTypes.find((a) => a.value === selectedAction)
                    ?.getValue(leagueStats);
                setQueryResult(answer);
                console.log(leagueStats);
                console.log(answer);
            }
            else {
            }
        }
        console.log(`action: ${selectedAction}, season: ${selectedSeason}, player: ${selectedPlayer}, league: ${selectedLeague}`);
        selectedAction && selectedSeason && selectedPlayer && selectedLeague && answerQuery();
    }, [selectedActionClass, selectedSeason, , selectedPlayer, selectedLeague])


    const handleActionChange = (actionInput: any) => {
        if (actionInput && actionInput.value !== selectedAction) {
            setSelectedAction(actionInput.value as number);
            actionInput.label.includes("Player") ? setSelectedActionClass("player") : setSelectedActionClass("team");
        }
    };

    const handleSeasonChange =  (seasonInput: any) => {
        if (seasonInput && seasonInput.value !== selectedSeason) {
             setSelectedSeason(seasonInput.value as number);
        }
    };

    const handleChangePlayer = async (playerInput: any) => {
        if (playerInput && playerInput.value !== selectedPlayer) {
            setSelectedPlayer(playerInput.value as number);
        }
    }
    
    const handleChangeLeague = async (leagueInput: any) => {
        if (leagueInput && leagueInput.value !== selectedLeague) {
            setSelectedLeague(leagueInput.value as number);
        }
    }

    return (
        <div className="tile tile--full">

            <h1 className="text-center font-extrabold text-6xl text-red-700 mb-10">Analyst Dashboard</h1>
            <div className="w-6/6 flex flex-inline">
                <div className="w-1/12 text-center"></div>
                <div className="w-2/6 text-center">
                    <Select
                        className="mb-7 font-extrabold text-2xl"
                        options={actionOptions}
                        value={actionTypes.find((option) => option.value === selectedAction)}
                        onChange={handleActionChange}
                        placeholder="Select an action"
                    />
                </div>
                <div className="w-2/12 text-center"></div>
                <div className="w-2/6 text-center">
                    <Select
                        className="mb-7 font-extrabold text-2xl"
                        options={seasons}
                        value={seasons.find((option) => option.value === selectedSeason)}
                        onChange={handleSeasonChange}
                        placeholder="Select a season"
                    />
                </div>
            </div>

            <div className="w-6/6 h-40 m-auto flex flex-inline">
                <div className="w-2/12"></div>
                <div className="w-2/12 text-center">
                    <Select
                        className={`leading-10 ${selectedActionClass !== "player" && "hidden"}`}
                        options={players.map((p) => {
                            return {value: p.player.id, label: p.player.name}
                        })}
                        value={players.find((option) => option.value === selectedPlayer)}
                        placeholder={"Select a player"}
                        onChange={handleChangePlayer}
                 />
                </div>
                <div className="w-4/12 text-center">
                    <img className="w-6/6 h-auto m-auto"
                         src={players.find((p) => p.player.id === selectedPlayer)?.player.photo}
                    />
                </div>
                <div className="w-2/12 text-center">
                    <Select
                        className="leading-10"
                        options={leaguesOptions}
                        value={players.find((option) => option.value === selectedLeague)}
                        placeholder={"Select a league"}
                        onChange={handleChangeLeague}
                    />
                </div>
            </div>
            <div className="w-6/6 h-40 text-center ">
                <h1 className="text-center font-extrabold text-4xl text-red-700 mb-10">
                    {queryResult ? queryResult : "No query result"}
                </h1>
            </div>
        </div>
    );
}