const bodyElement = document.getElementsByTagName("body")[0];
const mainElement = document.getElementsByTagName("main")[0];
const asideElement = document.getElementsByTagName("aside")[0];
const headerElement = document.getElementsByTagName("header")[0];


const bodyInfo = bodyElement.getBoundingClientRect();
const mainInfo = mainElement.getBoundingClientRect();
const asideInfo = asideElement.getBoundingClientRect();
const headerInfo = headerElement.getBoundingClientRect();


let mediaElements = [];
const mediaTypes = {
    "jpg" : "picture",
    "png" : "picture",
    "bmp" : "picture",
    "mp4" : "video",
    "avi" : "video",
    "flv" : "video",
    "mkv" : "video",
    "wmv" : "video",
}

let mediaPaths = [];
let contests = {};
let scores = {}

let currentRound = 0;


function getRandomNumber(min, max) 
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}


function getMaxCombinationNumber()
{
    let num = 0;
    let len = mediaPaths.length;
    for (let x = 0; x < len; x++)
    {
        num += len - (x + 1);
    }
    return num;
}


function didContest(one, two)
{
    for (const firstID in contests)
    {

        // If it's the two ones which we're talking about 
        if ((firstID == one) || (firstID == two))
        {
            // Search whether they already contested with each other
            let contestIDs = contests[firstID];
            for (let x = 0; x < contestIDs.length; x++)
            {

                if ((contestIDs[x] == one) || (contestIDs[x] == two))
                {
                    return true;
                }
            }
        }
    }

    return false;
}


function canContinueFurther()
{
    if (currentRound >= getMaxCombinationNumber())
    {
        endContest();
        return false;
    }
    return true;
}


function getSmallestNumber(list, customSmallest)
{
    let min = Infinity;
    for (let x = 0; x < list.length; x++)
    {
        if ((customSmallest && list[x] > customSmallest && list[x] < min) || ((!customSmallest) && (list[x] < min)) )
        {
            min = x;
        }
    }
    return min;
}


function getIDFromScore(score)
{
    for (let x = 0; x < scores.length; x++)
    {
        if (scores[x] == score)
        {
            return x;
        }
    }
    return false;
}


function endContest()
{
    
    let tempScores = [];
    let sortedScores = [];
    for (let x = 0; x < scores.length; x++)
    {
        tempScores[x] = scores[x];
    }

    while(sortedScores.length != tempScores.length)
    {
        if (sortedScores.length === 0)
        {
            sortedScores.push(getSmallestNumber(tempScores))
        } else {
            sortedScores.push(getSmallestNumber(tempScores, sortedScores[sortedScores.length - 1]));
        }
    }


    for (let x = sortedScores.length - 1; x >= 0; x--)
    {
        let mediaID = getIDFromScore(sortedScores[x]);
        let mediaName = getFilenameFromID(mediaID);
        console.log(`[${sortedScores[x]}] = ${mediaName}`);
    }

}


function getIDFromFilename(filename)
{
    for (let x = 0; x < mediaPaths.length; x++)
    {
        if (mediaPaths[x] == filename)
        {
            return x;
        }
    }
    return false;
}


function getFilenameFromID(id)
{
    return mediaPaths[id];
}


function givePoint(filename)
{
    let fileID = getIDFromFilename(filename);
    scores[fileID]++;
    let h3s = document.getElementsByTagName("h3");
    for (let x = 0; x < h3s.length; x++)
    {
        let h3 = h3s[x];
        let h3Text = h3.textContent;
        if (h3Text.search(filename) != -1)
        {
            h3.textContent = `(${scores[fileID]}) ${filename}`;
            break;
        }
    }
}


function deleteCurrentMedia()
{
    for (let x = 0; x < mediaElements.length; x++)
    {
        mediaElements[x].remove();
    }
    mediaElements = [];
}


function createImage(path)
{
    
    let originalPath = path;
    path = "med/" + path;
    
    const newElement = document.createElement("img");
    
    newElement.src = path;
    
    mainElement.appendChild(newElement);
    mediaElements.push(newElement);

    newElement.addEventListener("mouseover", () => {
        newElement.style.border = "2px solid white";
    })

    newElement.onmouseleave = () => {
        newElement.style.removeProperty("border");
    };

    newElement.onclick = () => {
        givePoint(originalPath);
        deleteCurrentMedia();
        if (canContinueFurther())
        {
            loadMedia();
        }
    }

}


function createVideo(path)
{

    let originalPath = path;
    path = "med/" + path;

    const newElement = document.createElement("video");
    
    newElement.src = path;
    newElement.autoplay = true;
    newElement.loop = true;
    newElement.muted = true;

    mainElement.appendChild(newElement);
    mediaElements.push(newElement);
    
    newElement.addEventListener("mouseover", () => {
        newElement.style.border = "2px solid white";
    })

    newElement.onmouseleave = () => {
        newElement.style.removeProperty("border");
    };

    newElement.onclick = () => {
        givePoint(originalPath);
        deleteCurrentMedia();
        if (canContinueFurther())
        {
            loadMedia();
        }
    }

}


function refreshDimensions()
{
    
    const bodyInfo = bodyElement.getBoundingClientRect();
    const mainInfo = mainElement.getBoundingClientRect();
    
    for (let x = 0; x < mediaElements.length; x++)
    {
        mediaElements[x].width = (mainInfo.width / 2.5);
    }

}

function isMedia(extension)
{
    return mediaTypes[extension] ? true : false;
}

function getMediaType(path)
{
    const ext = getMediaExtension(path);
    
    if (isMedia(ext))
    {
        return mediaTypes[ext];
    }

    return false;
}

function getMediaExtension(filepath)
{
    const ext = filepath.substring(filepath.length - 3, filepath.length);
    return ext;
}


function loadMedia()
{

    let num1 = getRandomNumber(0, mediaPaths.length - 1);
    let num2 = getRandomNumber(0, mediaPaths.length - 1);
    let iter = 0;

    while( ((num1 == num2) || (didContest(num1, num2))) && (iter < 10000) )
    {
        num1 = getRandomNumber(0, mediaPaths.length - 1);
        num2 = getRandomNumber(0, mediaPaths.length - 1);
        iter++;
    }

    let media1 = mediaPaths[num1];
    let media2 = mediaPaths[num2];

    if (getMediaType(media1) === "picture")
    {
        createImage(media1);
    } else 
    {
        createVideo(media1)
    }

    if (getMediaType(media2) === "picture")
    {
        createImage(media2);
    } else 
    {
        createVideo(media2)
    }

    contests[num1].push(num2);
    currentRound++;
    headerElement.textContent = `Round ${currentRound} of ${getMaxCombinationNumber()}`;

}


function boot()
{
    const ext = getMediaExtension("test.mp4");
    const ismedia = isMedia(ext);
    const extType = getMediaType(ext);
    setInterval(refreshDimensions, 50, 0);
}


// Uploading our own media.json
document.getElementById('show').addEventListener('click', function() {
  
    var file = document.getElementById('media-json').files[0];
    var reader = new FileReader();
    reader.readAsText(file, 'UTF-8');

    reader.onload = function(evt) {
        
        const result = evt.target.result;
        mediaPaths = JSON.parse(result);
        document.getElementById('content').innerHTML = `Loaded ${mediaPaths.length} media files.`;

        for (let x = 0; x < mediaPaths.length; x++)
        {
            contests[x] = [];
            scores[x] = 0;
            const newElement = document.createElement("h3");
            newElement.textContent = `(${scores[x]}) ${mediaPaths[x]}`;
            asideElement.appendChild(newElement);
        }
        
        loadMedia();

    }
    
  })

boot();
