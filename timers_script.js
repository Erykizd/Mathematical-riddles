var targetValue = 9;
var maxVolumes = [4,7];
var volumes = [];
var volumesGUI = document.getElementsByClassName("volume");
var tds = document.getElementsByTagName("td");
var volumesTable = document.getElementById("timersRiddle");
var inp2 = document.getElementById("inp2");
var inp3 = document.getElementById("inp3");
var flipBtn = document.getElementById("flipBtn");
var prevVal = -1;
var prevSel = -1;        
var curSel = -1;       
var descriptions = document.getElementsByClassName("description");
var dt = 500; //ms
var q = 2; //L/min
var stop = false;

setup();

function setup()
{
	let obj1 = volumesTable.children[1].children[0].children[0].outerHTML;
	let obj2 = volumesTable.children[1].children[1].children[0].outerHTML;
	
	for (let i = 0; i < maxVolumes.length-1; i++)
	{
		volumesTable.children[1].children[0].children[0].outerHTML += obj1;
		volumesTable.children[1].children[1].children[0].outerHTML += obj2;
	}
	
	for (let i = 0; i < maxVolumes.length; i++)
	{
			volumesGUI[2*i].value = maxVolumes[i]; // 0,2  0,1
			volumesGUI[2*i+1].value = 0; // 1,3
			volumes[i] = maxVolumes[i]; // 0,1  0,1
			volumesGUI[2*i].max = maxVolumes[i]; // 0,2  0,1
			volumesGUI[2*i].style.width = (20*maxVolumes[i]) + "px"; // 0,2  0,1
			volumesGUI[2*i+1].max = maxVolumes[i]; // 1,3  0,1
			volumesGUI[2*i+1].style.width = (20*maxVolumes[i]) + "px"; // 1,3  0,1
			descriptions[i].innerText = (maxVolumes[i] - volumes[i]) + " min / " + maxVolumes[i] + " min";
	}
	
	inp3.value = JSON.stringify(maxVolumes);
	inp3.addEventListener("change",()=>
	{
		for (let i = 0; i < maxVolumes.length-1; i++)
		{
			volumesTable.children[1].children[0].children[0].remove();
			volumesTable.children[1].children[1].children[0].remove();
		}
		
		try
		{
			maxVolumes = JSON.parse(inp3.value);
		}
		catch(error)
		{
			console.log("error: " + error);
		}
		setup();
	});
	
	dt = 0;
	refreshClock();
	refreshVolumes();

	for (let i = 0; i < maxVolumes.length; i++)
	{
		tds[i].addEventListener("click", ()=>{flipHourglass(i)});
		volumesGUI[i].style.setProperty("--delay", ((dt/1000) + "s"));
	}
	
	inp2.addEventListener("input", ()=>{q = inp2.value});
	inp2.min = 0;
	inp2.max = 9999;
	inp2.value = q;
	
	flipBtn.addEventListener("click", ()=>{flipAll()});
}

function refreshClock()
{
		let today = new Date();
		let day=zeroes(today.getDate());
		let month=zeroes(today.getMonth());
		let year=zeroes(today.getFullYear());
		let hour=zeroes(today.getHours());
		let minute=zeroes(today.getMinutes());
		let second=zeroes(today.getSeconds());
		
		document.getElementById("clock").innerHTML = day+"/"+month+"/"+year+" "+hour+":"+minute+":"+second;
		setTimeout("refreshClock()",1000);	
}

function zeroes(nr)
{
	let nr0="";
	if (nr<=9)
	{
			nr0="0"+nr
	} else 
	{
		nr0=nr;
	}
	return nr0;
}

function flipHourglass(selInd)
{
	switchTdName(selInd);

	setTimeout(()=>
	{
		switchTdName(selInd);
	}, 300);
	
	setTimeout(()=>
	{
		volumes[selInd] = maxVolumes[selInd]-volumes[selInd];
		volumesGUI[selInd] = volumes[selInd];
		volumesGUI[2*selInd+1] = maxVolumes[selInd] - volumesGUI[selInd];
		refreshVolumes();
	}, 150);
}

function flipAll()
{
	for (let i = 0; i < maxVolumes.length; i++)
	{
		flipHourglass(i);
	}
}

function switchTdName(selInd)
{
	if(tds[selInd].getAttribute("name") == "activated")
	{
		tds[selInd].setAttribute("name", "notActivated");
	}
	else if(tds[selInd].getAttribute("name") == "notActivated")
	{
		tds[selInd].setAttribute("name", "activated");
	}
}

function refreshVolumes()
{
	let dV = 0.1; //L
	let dt = dV/(q/60000); //L
	let sw = false;
	
	for (let i = 0; i < volumes.length; i++) // i = 0; 2
	{		
		for(let j = 0; j < (volumes[i]/dV); j++)
		{
			setTimeout(()=>
			{				
					volumes[i] = volumes[i] - dV; // i = 0; 1
					if(volumes[i]<0)
					{
						volumes[i] = 0;
					}
					
					volumesGUI[2*i].value = volumes[i]; // j=0 ; 2 i = 0; 1
					volumesGUI[2*i+1].value = maxVolumes[i] - volumes[i];
					descriptions[i].innerText = Math.round(maxVolumes[i] - volumes[i]) + " min / " + (maxVolumes[i]) + " min";
				
			}
			, j*dt);
		}	
	}
}
