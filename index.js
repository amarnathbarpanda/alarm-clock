fetch('./assets/alarm.wav')
    // .then(res=> res.json())
    .then((data) => {
        const audio = new Audio(data.url);
        audio.loop = true;

        //getting the referrences
        const currentTime = document.getElementById('curr_time').getElementsByTagName('span')[0];
        const setAlarmBtn = document.getElementById('set_alarm_btn');
        const alarmList = document.querySelector('#alarms');

        //this array will contain all the alarm set by the user
        let alarms = [];

        setAlarmBtn.addEventListener('click', () => {
            //getting the time enterred by the user
            const hours = document.getElementById('hours').value;
            const minutes = document.getElementById('minutes').value;
            const seconds = document.getElementById('seconds').value;
            const meridiem = document.getElementById('am_pm').value;

            //formatting the time 
            let newHours = getFormatedTime(hours);
            if (newHours === '0') {
                newHours = '00';
            }
            let newMins = getFormatedTime(minutes);
            if (newMins === '0') {
                newMins = '00';
            }
            let newSeconds = getFormatedTime(seconds);
            if (newSeconds === '0') {
                newSeconds = '00';
            }

            //converting time to string
            const newAlarm = `${newHours}:${newMins}:${newSeconds} ${meridiem}`;

            if (isNaN(newAlarm)) {
                //if time enterred by user does not exist in the alarms array then add the time.
                if (!alarms.includes(newAlarm)) {
                    alarms.push(newAlarm);
                    displayUpdatedAlarms(newAlarm);
                    resetInput();
                } else {
                    alert(`Alarm for ${newAlarm} is already set.`);
                }
            } else {
                alert(`Invalid Time!`);
            }
        });

        //to add new alarm into the existing list of alarms
        function displayUpdatedAlarms(newAlarm) {
            const listItem = `
        <li class="alarm">
            <span><i class="fa-solid fa-bell" title="Mute" onclick="muteAlarm()"></i> ${newAlarm}</span>
            <i class="fa-solid fa-trash" title="Delete" data-alarm="${newAlarm}"></i>
        </li>`

            alarmList.innerHTML += listItem;
        }


        //this method display current time and simultaneously it checks whether the current time is equal to any of the alarm time if yes, then it calls ringBell() to play alarm tone
        function getCurrentTime() {

            //getting current Time

            let now = new Date();
            let hr = now.getHours();
            let min = now.getMinutes();
            let sec = now.getSeconds();

            //finding out the meridiem 

            const meridiem = hr >= 12 ? "PM" : "AM";
            if (hr > 12) {
                hr = hr % 12;
            }
            hr = getFormatedTime(hr);
            min = getFormatedTime(min);
            sec = getFormatedTime(sec);
            const time = `${hr}:${min}:${sec} ${meridiem}`;

            currentTime.innerHTML = time;
            setTimeout(() => {
                getCurrentTime();
                if (alarms.includes(time)) {
                    ringBell(time);
                }
            }, 1000);
        }
        getCurrentTime();

        //to start playing alarm
        function ringBell(time) {
            audio.play();
            alert(`It's ${time}`);
        }

        //to mute or pause the alarm tone
        function muteAlarm() {
            audio.pause();
        }

        //this method adds 0 before hours/mins/seconds if it's less than 10 to make it look good.
        function getFormatedTime(time) {
            if (time < 10) {
                return '0' + time;
            }
            return time;
        }

        alarmList.addEventListener('click', (e) => {
            if (e.target.classList.contains('fa-trash')) {

                //delete the alarm array 'alarms'
                const currAlarm = e.target.getAttribute('data-alarm');
                let newAlarms = alarms.filter((time) => time != currAlarm);
                alarms = newAlarms;

                //delete the alarm from ul element
                e.target.parentElement.remove();
                audio.pause();
            }

            if (e.target.classList.contains('fa-bell')) {
                e.target.classList.remove('fa-bell');
                e.target.classList.add('fa-bell-slash');
                document.querySelector('.fa-bell-slash').style.color = "rgb(59, 59, 59)";
                muteAlarm();
            }
        });

        //to reset all the input fields
        function resetInput() {
            hours.value = '';
            minutes.value = '';
            seconds.value = '';
        }
    }).catch(err => console.log(`Error is -> ${err}`));






