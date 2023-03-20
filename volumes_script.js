var maxVolumes = [5,9,11];
var volumes = [0,0,11];
var volumesGUI = document.getElementsByClassName("volume");
var solveBtn = document.getElementById("solveBtn");
var stopBtn = document.getElementById("stopBtn");
var volumesTable = document.getElementById("volumesRiddle");
var inp1 = document.getElementById("inp1");
var inp2 = document.getElementById("inp2");
var inp3 = document.getElementById("inp3");
var inp4 = document.getElementById("inp4");
var prevVal = -1;
var prevSel = -1;        
var curSel = -1;       
var descriptions = document.getElementsByClassName("description");
var dt = 500;
var q = 240; //L/min
var stop = false; 
var targetValue = 0;
var baseAngle = -90;

setup();

function setup()
{
	let jsonObj = "";
	inp4.value = JSON.stringify(volumes);
	inp4.addEventListener("change",()=>
	{
		for (let i = 0; i < volumes.length-1; i++)
		{
			volumesTable.children[1].children[0].children[0].remove();
			volumesTable.children[1].children[1].children[0].remove();
		}
		
		try
		{
			volumes	= JSON.parse(inp4.value);		
		}
		catch(error)
		{
			console.log("error: " + error);
		}
		setup();
	});
	
	inp3.value = JSON.stringify(maxVolumes);
	inp3.addEventListener("change",()=>
	{
		for (let i = 0; i < volumes.length-1; i++)
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
	
	let obj1 = volumesTable.children[1].children[0].children[0].outerHTML;
	let obj2 = volumesTable.children[1].children[1].children[0].outerHTML;
	
	for (let i = 0; i < volumes.length-1; i++)
	{
		volumesTable.children[1].children[0].children[0].outerHTML += obj1;
		volumesTable.children[1].children[1].children[0].outerHTML += obj2;
	}
	dt = 0;
	refreshClock();
	refreshVolumes();

	for (let i = 0; i < volumes.length; i++)
	{
		volumesGUI[i].addEventListener("click", ()=>{changeVolumes(i)});
		volumesGUI[i].style.setProperty("--delay", ((dt/1000) + "s"));
		rotate(prevSel, ((0 + baseAngle) + 'deg'))
	}
	
	solveBtn.addEventListener("click", ()=>{stop = false; solveRandomly()});
	stopBtn.addEventListener("click", ()=>{stop = true});

	inp1.addEventListener("input", ()=>{targetValue = Number(inp1.value)});
	inp1.min = 0;
	inp1.max = 11;
	inp1.value = 8;
	targetValue = Number(inp1.value);

	inp2.addEventListener("input", ()=>{q = inp2.value});
	inp2.min = 0;
	inp2.max = 9999;
	inp2.value = q;
	
	dt = 300;
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

function changeVolumes(selectedVolume)
{
	curSel = selectedVolume;
	for (let i = 0; i < volumes.length; i++)
	{
		volumes[i] = volumesGUI[i].value;
    }
	
	let fill = 0;

	if (prevVal != -1)
	{	
        let fillAble = maxVolumes[selectedVolume] - volumes[selectedVolume];
        let spillAble = prevVal;
		
        if (spillAble >= fillAble)
		{
            spill = fillAble;
		}
		else
		{
            spill = spillAble;				
		}
        
		dt = 1000*spill/(q/60); //ms
		
		volumes[selectedVolume] = volumes[selectedVolume] + spill;
		volumes[prevSel] = volumes[prevSel] - spill;
		
		let dInd = selectedVolume - prevSel;
		if (maxVolumes[prevSel]>5)
		{
			translate(prevSel, ((dInd*30) + '%'), (-180 + '%'));	
		}
		else
		{
			translate(prevSel, ((dInd*150) + '%'), (-150 + '%'));
		}
		
		if(prevSel < selectedVolume)
		{
			rotate(prevSel, ((45 + baseAngle) + 'deg'));	
		}
		else
		{
			rotate(prevSel, ((-45 + baseAngle) + 'deg'));
		}
		
		refreshVolumes();
		
		prevVal = -1;
        prevSel = -1;
	}
    else
	{
		prevVal = volumes[selectedVolume];
	    prevSel = selectedVolume; 
		refreshVolumes();
    }
}

function refreshVolumes()
{
	let dV = 0;
	let dV0 = [];
	let nrOfSamples = 100;
	
	setTimeout(()=>
	{	
		for (let i = 0; i < volumes.length; ++i)
		{
			volumesGUI[i].value = volumes[i];
			descriptions[i].innerHTML = Math.round(volumesGUI[i].value) + " L / " + maxVolumes[i] + " L ";
		}
	},dt);
	
	for (let i = 0; i < volumes.length; ++i)
	{
		volumesGUI[i].max = maxVolumes[i];
		volumesGUI[i].style.setProperty('width', ((maxVolumes[i] * 9) + "%"));
	}	
	
	for(let j = 0; j < nrOfSamples; ++j)
	{
		for(let i = 0; i < volumes.length; ++i)		
		{
			if(volumesGUI[i].value - volumes[i] != 0)
			{
				setTimeout(()=>
				{
					dV = volumesGUI[i].value - volumes[i];
					if(j==0)
					{
						dV0[i] = dV;
					}
					volumesGUI[i].value = volumesGUI[i].value - dV0[i]/nrOfSamples;
					descriptions[i].innerHTML = Math.round(volumesGUI[i].value) + " L / " + maxVolumes[i] + " L ";
				}, (dt/nrOfSamples)*j);
			}
		}
	}
}

function rotate(ind, angleStr)
{
	if(prevSel >= 0)
	{
		volumesGUI[ind].style.setProperty('--angle', angleStr);
	}
	

	setTimeout(()=>
	{
		for (let i = 0; i < volumes.length; i++)
		{
			volumesGUI[i].max = maxVolumes[i];
			volumesGUI[i].value = volumes[i];
			volumesGUI[i].style.setProperty('--angle', ((0 + baseAngle) + 'deg'));
		}
	}, dt);
	
}

function translate(ind, dxStr, dyStr)
{
	if(prevSel >= 0)
	{
		volumesGUI[ind].style.setProperty('--moveX', dxStr);
		volumesGUI[ind].style.setProperty('--moveY', dyStr);
	}	

	setTimeout(()=>
	{
		for (let i = 0; i < volumes.length; i++)
		{
			volumesGUI[i].max = maxVolumes[i];
			volumesGUI[i].value = volumes[i];
			volumesGUI[i].style.setProperty('--moveX', (0 + '%'));
			volumesGUI[i].style.setProperty('--moveY', (0 + 'px'));
		}
	}, dt);
}

function solveRandomly()
{
	let rNr;
	if ((volumes.indexOf(targetValue) == -1) && (!stop))
	{
		setTimeout(()=>
			{
				rNr = Math.round(Math.random()*(volumes.length-1));
				changeVolumes(rNr);
				solveRandomly();
			}, dt);
	}
}
