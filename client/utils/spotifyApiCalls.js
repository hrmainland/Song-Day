import baseUrl from "./urlPrefix.js";

export async function ping(){
    const response = await fetch(`${baseUrl}/spotify/ping`);
    return await response.json();
}

export async function searchTracks(query){
    const response = await fetch(`${baseUrl}/spotify/searchTracks?q=${query}&type=track`);
    return await response.json();
}

export async function getMultipleTracksById(trackIds){
    const url = `${baseUrl}/spotify/tracks?ids=${encodeURIComponent(trackIds.join(","))}`;
    const response = await fetch(url);
    return await response.json();
}