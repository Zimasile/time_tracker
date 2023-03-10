// access tabs and panels
const tabs = [ ... document.querySelectorAll('[role=tab]')];

// show panel on selection of tabs
tabs.forEach(tab => {
  tab.addEventListener('click', handleTabClick)
})

// keyboard events
window.addEventListener('keydown', handleKeyDownEvent);

function handleTabClick(e){
  //PUT THE PANELS ELEMENT INSIDE THIS FUNCTION INSTEAD OF UNIVERSALLY DECLARING IT (OUTSIDE OF THIS FUNCTION)
  //SO THAT ITS PUT IN THE DOM TO REFERENCE IT
  const panels = [ ... document.querySelectorAll('[role=tabpanel]')]; 
  
  // get panel to show
  const panelToControl = e.currentTarget.getAttribute('aria-controls')

  // loop through all panels and hide/show correct panel
  panels.forEach(p => {
    p.setAttribute('aria-hidden', `${p.id === panelToControl ? 'false' : 'true'}`) 
  })
  // update the aria label for correct button
  tabs.forEach(t => {
    t.setAttribute('aria-selected', `${t === e.currentTarget ? 'true' : 'false'}`)
  })
}

function handleKeyDownEvent(e){
  const actEl = document.activeElement
  if(!actEl.classList.contains('tab')){return}
  switch(e.key){
    case 'ArrowLeft':
      if(actEl === tabs[0]){
        return tabs[tabs.length -1].focus();
      }
      actEl.previousElementSibling.focus();
      break;
    case 'ArrowRight':
      if(actEl === tabs[tabs.length -1]){
        return tabs[0].focus();
      }
      actEl.nextElementSibling.focus();
      break;
    default:
      return;
  }

}

function getTimeMeasurement(time){
  switch(time){
    case "daily":
      return "yesterday"
    case "weekly":
      return "Last week"
    case "monthly":
      return "Last month"
    default:
      return;
  }
}

function retrieveTimeData(obj, period){
  return obj.time[period];

}

function generateCardHTMLString(data){
  const htmlString = Object.entries(data).map(time => {
    const timePeriod = time[0];
    const timePrevious = getTimeMeasurement(timePeriod)

    // Template literal of the time data fetch for the cards

    return `
    <div class="container__cards" role="tabpanel" aria-labelledby="tab-monthly" id="panel-${timePeriod}" tabindex="0" aria-hidden="${timePeriod === 'daily' ? 'false' : 'true'}">
        <div class="card work">
          <div class="card__img">
            <img src="images/icon-work.svg" alt="">
          </div>
          <div class="details">
            <div class="heading">
              <p>Work</p>
              <button>
                <img src="images/icon-ellipsis.svg" alt="">
              </button>
            </div>
            <div class="amount">
              <p class="current">
                ${retrieveTimeData(... time[1].filter(t => t.title === "Work"), 'current')}hrs
              </p>
              <p class="previous">${timePrevious} - <span class="previous__hours">${retrieveTimeData(... time[1].filter(t => t.title === "Work"), 'previous')}hrs</span></p>
            </div>
          </div>
        </div>
        <div class="card play">
          <div class="card__img">
            <img src="images/icon-play.svg" alt="">
          </div>
          <div class="details">
            <div class="heading">
              <p>Play</p>
              <button>
                <img src="images/icon-ellipsis.svg" alt="">
              </button>
            </div>
            <div class="amount">
            <p class="current">
            ${retrieveTimeData(... time[1].filter(t => t.title === "Play"), 'current')}hrs
          </p>
          <p class="previous">${timePrevious} - <span class="previous__hours">${retrieveTimeData(... time[1].filter(t => t.title === "Play"), 'previous')}hrs</span></p>
            </div>
          </div>
        </div>
        <div class="card study">
          <div class="card__img">
            <img src="images/icon-study.svg" alt="">  
          </div>
          <div class="details">
            <div class="heading">
              <p>Study</p>
              <button>
                <img src="images/icon-ellipsis.svg" alt="">
              </button>
            </div>
            <div class="amount">
            <p class="current">
            ${retrieveTimeData(... time[1].filter(t => t.title === "Study"), 'current')}hrs
          </p>
          <p class="previous">${timePrevious} - <span class="previous__hours">${retrieveTimeData(... time[1].filter(t => t.title === "Study"), 'previous')}hrs</span></p>
            </div>
          </div>
        </div>
        <div class="card exercise">
          <div class="card__img">
            <img src="images/icon-exercise.svg" alt="">
          </div>
          <div class="details">
            <div class="heading">
              <p>Exercise</p>
              <button>
                <img src="images/icon-ellipsis.svg" alt="">
              </button>
            </div>
            <div class="amount">
            <p class="current">
            ${retrieveTimeData(... time[1].filter(t => t.title === "Exercise"), 'current')}hrs
          </p>
          <p class="previous">${timePrevious} - <span class="previous__hours">${retrieveTimeData(... time[1].filter(t => t.title === "Exercise"), 'previous')}hrs</span></p>
            </div>
          </div>
        </div>
        <div class="card social">
          <div class="card__img">
            <img src="images/icon-social.svg" alt="">
          </div>
          <div class="details">
            <div class="heading">
              <p>Social</p>
              <button>
                <img src="images/icon-ellipsis.svg" alt="">
              </button>
            </div>
            <div class="amount">
            <p class="current">
            ${retrieveTimeData(... time[1].filter(t => t.title === "Social"), 'current')}hrs
          </p>
          <p class="previous">${timePrevious} - <span class="previous__hours">${retrieveTimeData(... time[1].filter(t => t.title === "Social"), 'previous')}hrs</span></p>
            </div>
          </div>
        </div>
        <div class="card self-care">
          <div class="card__img">
            <img src="images/icon-self-care.svg" alt="">
          </div>
          <div class="details">
            <div class="heading">
              <p>Self Care</p>
              <button>
                <img src="images/icon-ellipsis.svg" alt="">
              </button>
            </div>
            <div class="amount">
            <p class="current">
            ${retrieveTimeData(... time[1].filter(t => t.title === "Self Care"), 'current')}hrs
          </p>
          <p class="previous">${timePrevious} - <span class="previous__hours">${retrieveTimeData(... time[1].filter(t => t.title === "Self Care"), 'previous')}hrs</span></p>
            </div>
          </div>
        </div>
      </div>
    `
  }).join('')

  return htmlString;
}

// Live Data Fetch

async function fetchLiveData(){
  const data = await fetch('./data.json')
  const body = await data.json();
  // loop through each object and filter out daily, weekly and monthly into an array
  const dailyData = body.map(type => (
    {
      time: type.timeframes.daily,
      title: type.title,
    }
  ));
  
  const weeklyData = body.map(type => (
    {
      time: type.timeframes.weekly,
      title: type.title,
    }
  ));
  
  const monthlyData = body.map(type => (
    {
      time: type.timeframes.monthly,
      title: type.title,
    }
  ));

  // pass each array to their function in an appropriate location
  document.querySelector('#panel-container').innerHTML =
    generateCardHTMLString({
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData
  })
}

fetchLiveData()

