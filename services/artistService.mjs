import { loadDataFile, saveData, validateData } from "../utils/dataManager.mjs";

const filename = "artists";

let artists = loadDataFile(filename);

function findAllService() { 
    return artists;
 }

function findService(id) { 
    return artists.find((artist) => artist.id === parseInt(id));
 }

 function createService(newArtist) {
    if (!validateData(newArtist, ["name", "country", "genres"])) return false;
    const id = artists.length > 0 ? artists[artists.length - 1].id + 1 : 1;
    const artist = { id, ...newArtist };
    artists.push(artist);
    saveData(filename, artists);
    return artist;
  }
  


function updateService(id, updatedArtist) {
    if (!validateData(updatedArtist, ["name", "country", "genres"])) return false;
    let index = artists.findIndex((artist) => artist.id === parseInt(id));
    if (index === -1) return false;
    artists[index] = { id: parseInt(id), ...updatedArtist };
    saveData(filename, artists);
    return artists[index];
  }
  

  function removeService(id) {
    const index = artists.findIndex(artist => artist.id === parseInt(id));
    if (index === -1) return false;
    artists.splice(index, 1);
    saveData(filename, artists);
    return true;
  }
  

export {
  findAllService,
  findService,
  createService,
  updateService,
  removeService,
};
